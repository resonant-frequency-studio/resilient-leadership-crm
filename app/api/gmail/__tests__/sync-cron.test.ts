// Mock dependencies before importing route
jest.mock("@/lib/firebase-admin", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockModule = require("@/lib/__mocks__/firebase-admin");
  return {
    adminDb: mockModule.adminDb,
  };
});
jest.mock("@/lib/gmail/sync-job-runner", () => ({
  runSyncJob: jest.fn(),
}));
jest.mock("@/lib/calendar/cron-helpers", () => ({
  getAllUsersWithGmailAccess: jest.fn(),
}));
jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
      ok: (init?.status || 200) >= 200 && (init?.status || 200) < 300,
    })),
  },
}));

import { POST } from "../sync-cron/route";
import { runSyncJob } from "@/lib/gmail/sync-job-runner";
import { getAllUsersWithGmailAccess } from "@/lib/calendar/cron-helpers";
import { reportException } from "@/lib/error-reporting";
import { NextResponse } from "next/server";

const mockRunSyncJob = runSyncJob as jest.MockedFunction<typeof runSyncJob>;
const mockGetAllUsersWithGmailAccess = getAllUsersWithGmailAccess as jest.MockedFunction<typeof getAllUsersWithGmailAccess>;
const mockReportException = reportException as jest.MockedFunction<typeof reportException>;
const mockNextResponseJson = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("POST /api/gmail/sync-cron", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.CRON_SECRET;
  });

  describe("Authentication", () => {
    it("should accept Vercel cron requests", async () => {
      mockGetAllUsersWithGmailAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockGetAllUsersWithGmailAccess).toHaveBeenCalled();
    });

    it("should accept requests with CRON_SECRET in Authorization header", async () => {
      mockGetAllUsersWithGmailAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          authorization: "Bearer test-secret",
        },
      });

      await POST(req);

      expect(mockGetAllUsersWithGmailAccess).toHaveBeenCalled();
    });

    it("should accept requests with CRON_SECRET in query parameter", async () => {
      mockGetAllUsersWithGmailAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/gmail/sync-cron?secret=test-secret", {
        method: "POST",
      });

      await POST(req);

      expect(mockGetAllUsersWithGmailAccess).toHaveBeenCalled();
    });

    it("should reject requests without valid auth", async () => {
      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
      });

      const response = await POST(req);
      const result = await response.json();

      expect(result.error).toContain("Unauthorized");
      expect(response.status).toBe(401);
      expect(mockGetAllUsersWithGmailAccess).not.toHaveBeenCalled();
    });

    it("should reject requests with wrong secret", async () => {
      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          authorization: "Bearer wrong-secret",
        },
      });

      const response = await POST(req);
      const result = await response.json();

      expect(result.error).toContain("Unauthorized");
      expect(response.status).toBe(401);
    });
  });

  describe("Sync Execution", () => {
    it("should call runSyncJob for each user with Gmail access", async () => {
      const userIds = ["user1", "user2", "user3"];
      mockGetAllUsersWithGmailAccess.mockResolvedValue(userIds);
      mockRunSyncJob.mockResolvedValue({
        success: true,
        syncJobId: "job1",
        processedThreads: 10,
        processedMessages: 25,
      });

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockRunSyncJob).toHaveBeenCalledTimes(3);
      expect(mockRunSyncJob).toHaveBeenCalledWith({
        userId: "user1",
        type: "auto",
      });
      expect(mockRunSyncJob).toHaveBeenCalledWith({
        userId: "user2",
        type: "auto",
      });
      expect(mockRunSyncJob).toHaveBeenCalledWith({
        userId: "user3",
        type: "auto",
      });
    });

    it("should aggregate results correctly", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithGmailAccess.mockResolvedValue(userIds);
      mockRunSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedThreads: 10,
          processedMessages: 25,
        })
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job2",
          processedThreads: 5,
          processedMessages: 15,
        });

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalThreads: number; totalMessages: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalThreads: 15,
        totalMessages: 40,
        totalErrors: 0,
      });
      expect(responseBody.errors).toBeUndefined();
    });

    it("should handle failed syncs gracefully", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithGmailAccess.mockResolvedValue(userIds);
      mockRunSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedThreads: 10,
          processedMessages: 25,
        })
        .mockResolvedValueOnce({
          success: false,
          syncJobId: "job2",
          processedThreads: 0,
          processedMessages: 0,
          errorMessage: "Sync failed",
        });

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalThreads: number; totalMessages: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalThreads: 10,
        totalMessages: 25,
        totalErrors: 1,
      });
      expect(responseBody.errors).toBeDefined();
      expect(responseBody.errors).toEqual(expect.arrayContaining([expect.stringContaining("user2")]));
    });

    it("should handle exceptions per user gracefully", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithGmailAccess.mockResolvedValue(userIds);
      mockRunSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedThreads: 10,
          processedMessages: 25,
        })
        .mockRejectedValueOnce(new Error("Database error"));

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockReportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          context: "Syncing Gmail threads for user in cron",
          tags: { component: "gmail-sync-cron", userId: "user2" },
        })
      );

      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalThreads: number; totalMessages: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalThreads: 10,
        totalMessages: 25,
        totalErrors: 1,
      });
      expect(responseBody.errors).toBeDefined();
      expect(responseBody.errors).toEqual(expect.arrayContaining([expect.stringContaining("user2")]));
    });

    it("should handle empty user list", async () => {
      mockGetAllUsersWithGmailAccess.mockResolvedValue([]);

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockRunSyncJob).not.toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalThreads: number; totalMessages: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 0,
        totalThreads: 0,
        totalMessages: 0,
        totalErrors: 0,
      });
      expect(responseBody.errors).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle errors in getAllUsersWithGmailAccess", async () => {
      mockGetAllUsersWithGmailAccess.mockRejectedValue(new Error("Database error"));

      const req = new Request("http://localhost/api/gmail/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      const response = await POST(req);
      const result = await response.json();

      expect(result.ok).toBe(false);
      expect(result.error).toBe("Database error");
      expect(response.status).toBe(500);
      expect(mockReportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          context: "Gmail sync cron job",
          tags: { component: "gmail-sync-cron" },
        })
      );
    });
  });
});

