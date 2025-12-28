// Mock dependencies before importing route
jest.mock("@/lib/firebase-admin", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockModule = require("@/lib/__mocks__/firebase-admin");
  return {
    adminDb: mockModule.adminDb,
  };
});
jest.mock("@/lib/google-contacts/sync-job-runner", () => ({
  runContactsSyncJob: jest.fn(),
}));
jest.mock("@/lib/calendar/cron-helpers", () => ({
  getAllUsersWithContactsAccess: jest.fn(),
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
import { runContactsSyncJob } from "@/lib/google-contacts/sync-job-runner";
import { getAllUsersWithContactsAccess } from "@/lib/calendar/cron-helpers";
import { reportException } from "@/lib/error-reporting";
import { NextResponse } from "next/server";

const mockRunContactsSyncJob = runContactsSyncJob as jest.MockedFunction<typeof runContactsSyncJob>;
const mockGetAllUsersWithContactsAccess = getAllUsersWithContactsAccess as jest.MockedFunction<typeof getAllUsersWithContactsAccess>;
const mockReportException = reportException as jest.MockedFunction<typeof reportException>;
const mockNextResponseJson = NextResponse.json as jest.MockedFunction<typeof NextResponse.json>;

describe("POST /api/contacts/sync-cron", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.CRON_SECRET;
  });

  describe("Authentication", () => {
    it("should accept Vercel cron requests", async () => {
      mockGetAllUsersWithContactsAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockGetAllUsersWithContactsAccess).toHaveBeenCalled();
    });

    it("should accept requests with CRON_SECRET in Authorization header", async () => {
      mockGetAllUsersWithContactsAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          authorization: "Bearer test-secret",
        },
      });

      await POST(req);

      expect(mockGetAllUsersWithContactsAccess).toHaveBeenCalled();
    });

    it("should accept requests with CRON_SECRET in query parameter", async () => {
      mockGetAllUsersWithContactsAccess.mockResolvedValue([]);
      
      const req = new Request("http://localhost/api/contacts/sync-cron?secret=test-secret", {
        method: "POST",
      });

      await POST(req);

      expect(mockGetAllUsersWithContactsAccess).toHaveBeenCalled();
    });

    it("should reject requests without valid auth", async () => {
      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
      });

      const response = await POST(req);
      const result = await response.json();

      expect(result.error).toContain("Unauthorized");
      expect(response.status).toBe(401);
      expect(mockGetAllUsersWithContactsAccess).not.toHaveBeenCalled();
    });

    it("should reject requests with wrong secret", async () => {
      const req = new Request("http://localhost/api/contacts/sync-cron", {
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
    it("should call runContactsSyncJob for each user with Contacts access", async () => {
      const userIds = ["user1", "user2", "user3"];
      mockGetAllUsersWithContactsAccess.mockResolvedValue(userIds);
      mockRunContactsSyncJob.mockResolvedValue({
        success: true,
        syncJobId: "job1",
        processedContacts: 10,
        skippedContacts: 2,
      });

      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockRunContactsSyncJob).toHaveBeenCalledTimes(3);
      expect(mockRunContactsSyncJob).toHaveBeenCalledWith({
        userId: "user1",
      });
      expect(mockRunContactsSyncJob).toHaveBeenCalledWith({
        userId: "user2",
      });
      expect(mockRunContactsSyncJob).toHaveBeenCalledWith({
        userId: "user3",
      });
    });

    it("should aggregate results correctly", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithContactsAccess.mockResolvedValue(userIds);
      mockRunContactsSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedContacts: 10,
          skippedContacts: 2,
        })
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job2",
          processedContacts: 5,
          skippedContacts: 1,
        });

      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalImported: number; totalSkipped: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalImported: 15,
        totalSkipped: 3,
        totalErrors: 0,
      });
      expect(responseBody.errors).toBeUndefined();
    });

    it("should handle failed syncs gracefully", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithContactsAccess.mockResolvedValue(userIds);
      mockRunContactsSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedContacts: 10,
          skippedContacts: 2,
        })
        .mockResolvedValueOnce({
          success: false,
          syncJobId: "job2",
          processedContacts: 0,
          skippedContacts: 0,
          errorMessage: "Sync failed",
        });

      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalImported: number; totalSkipped: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalImported: 10,
        totalSkipped: 2,
        totalErrors: 1,
      });
      expect(responseBody.errors).toBeDefined();
      expect(responseBody.errors).toEqual(expect.arrayContaining([expect.stringContaining("user2")]));
    });

    it("should handle exceptions per user gracefully", async () => {
      const userIds = ["user1", "user2"];
      mockGetAllUsersWithContactsAccess.mockResolvedValue(userIds);
      mockRunContactsSyncJob
        .mockResolvedValueOnce({
          success: true,
          syncJobId: "job1",
          processedContacts: 10,
          skippedContacts: 2,
        })
        .mockRejectedValueOnce(new Error("Database error"));

      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockReportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          context: "Syncing contacts for user in cron",
          tags: { component: "contacts-sync-cron", userId: "user2" },
        })
      );

      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalImported: number; totalSkipped: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 2,
        totalImported: 10,
        totalSkipped: 2,
        totalErrors: 1,
      });
      expect(responseBody.errors).toBeDefined();
      expect(responseBody.errors).toEqual(expect.arrayContaining([expect.stringContaining("user2")]));
    });

    it("should handle empty user list", async () => {
      mockGetAllUsersWithContactsAccess.mockResolvedValue([]);

      const req = new Request("http://localhost/api/contacts/sync-cron", {
        method: "POST",
        headers: {
          "x-vercel-cron": "1",
        },
      });

      await POST(req);

      expect(mockRunContactsSyncJob).not.toHaveBeenCalled();
      expect(mockNextResponseJson).toHaveBeenCalled();
      const callArgs = mockNextResponseJson.mock.calls[0];
      const responseBody = callArgs[0] as { ok: boolean; usersProcessed: number; totalImported: number; totalSkipped: number; totalErrors: number; errors?: string[] | undefined };
      expect(responseBody).toMatchObject({
        ok: true,
        usersProcessed: 0,
        totalImported: 0,
        totalSkipped: 0,
        totalErrors: 0,
      });
      expect(responseBody.errors).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle errors in getAllUsersWithContactsAccess", async () => {
      mockGetAllUsersWithContactsAccess.mockRejectedValue(new Error("Database error"));

      const req = new Request("http://localhost/api/contacts/sync-cron", {
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
          context: "Contacts sync cron job",
          tags: { component: "contacts-sync-cron" },
        })
      );
    });
  });
});

