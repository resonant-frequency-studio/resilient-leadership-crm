// Mock dependencies before importing route
jest.mock("@/lib/firebase-admin", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockModule = require("@/lib/__mocks__/firebase-admin");
  return {
    adminDb: mockModule.adminDb,
  };
});
jest.mock("@/lib/google-people/enrich-contact-from-email");
jest.mock("@/util/email-name-extraction", () => ({
  ...jest.requireActual("@/util/email-name-extraction"),
  isWellFormedName: jest.fn(),
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

import { POST } from "../../admin/enrich-contacts-with-people-api/route";
import { adminDb } from "@/lib/firebase-admin";
import { enrichContactFromEmail } from "@/lib/google-people/enrich-contact-from-email";
import { isWellFormedName } from "@/util/email-name-extraction";
import { createMockDocSnapshot, createMockQuerySnapshot } from "@/lib/__mocks__/firebase-admin";
import { Contact } from "@/types/firestore";

describe("POST /api/admin/enrich-contacts-with-people-api", () => {
  const mockUserId = "user123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if userId is missing", async () => {
    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("userId is required");
  });

  it("should return empty result when no contacts found", async () => {
    const mockEmptySnapshot = createMockQuerySnapshot([]);
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockEmptySnapshot),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.processed).toBe(0);
    expect(data.updated).toBe(0);
    expect(data.skipped).toBe(0);
    expect(data.errors).toBe(0);
  });

  it("should enrich contacts and update missing fields", async () => {
    const mockContact1: Contact = {
      contactId: "contact1",
      primaryEmail: "john.doe@example.com",
      firstName: null,
      lastName: null,
      company: null,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContact2: Contact = {
      contactId: "contact2",
      primaryEmail: "jane.smith@example.com",
      firstName: "Jane",
      lastName: null,
      company: null,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContacts = [
      createMockDocSnapshot(mockContact1, "contact1"),
      createMockDocSnapshot(mockContact2, "contact2"),
    ];

    const mockSnapshot = createMockQuerySnapshot(mockContacts);
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockSnapshot),
      doc: jest.fn().mockReturnValue({
        update: jest.fn().mockResolvedValue(undefined),
      }),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    (enrichContactFromEmail as jest.Mock)
      .mockResolvedValueOnce({
        firstName: "John",
        lastName: "Doe",
        company: "Example Corp",
        photoUrl: null,
        source: "people_api",
      })
      .mockResolvedValueOnce({
        firstName: null,
        lastName: "Smith",
        company: null,
        photoUrl: null,
        source: "people_api",
      });

    (isWellFormedName as jest.Mock)
      .mockReturnValueOnce(false) // contact1 firstName
      .mockReturnValueOnce(false) // contact1 lastName
      .mockReturnValueOnce(false) // contact2 firstName
      .mockReturnValueOnce(false); // contact2 lastName

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId, dryRun: false }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.processed).toBe(2);
    expect(data.updated).toBe(2);
    expect(enrichContactFromEmail).toHaveBeenCalledTimes(2);
  });

  it("should skip contacts with all fields well-formed", async () => {
    const mockContact: Contact = {
      contactId: "contact1",
      primaryEmail: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      company: "Example Corp",
      photoUrl: "https://lh3.googleusercontent.com/a-/ALV-UjWzYU6MOulzLRUqMj_-296EjSTQYh4VF14FFweLay9lUHDIxhHV=s48-p", // Real photo (not default avatar)
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContacts = [createMockDocSnapshot(mockContact, "contact1")];
    const mockSnapshot = createMockQuerySnapshot(mockContacts);
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockSnapshot),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    (enrichContactFromEmail as jest.Mock).mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      company: "Example Corp",
      photoUrl: null, // No new photo to add
      source: "people_api",
    });

    (isWellFormedName as jest.Mock)
      .mockReturnValue(true); // All fields well-formed

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId, dryRun: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.processed).toBe(1);
    expect(data.skipped).toBe(1);
    expect(data.updated).toBe(0);
  });

  it("should skip contacts with no email", async () => {
    const mockContact: Contact = {
      contactId: "contact1",
      primaryEmail: "",
      firstName: null,
      lastName: null,
      company: null,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContacts = [createMockDocSnapshot(mockContact, "contact1")];
    const mockSnapshot = createMockQuerySnapshot(mockContacts);
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockSnapshot),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId, dryRun: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.processed).toBe(1);
    expect(data.skipped).toBe(1);
    expect(enrichContactFromEmail).not.toHaveBeenCalled();
  });

  it("should handle errors gracefully", async () => {
    const mockContact: Contact = {
      contactId: "contact1",
      primaryEmail: "john.doe@example.com",
      firstName: null,
      lastName: null,
      company: null,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContacts = [createMockDocSnapshot(mockContact, "contact1")];
    const mockSnapshot = createMockQuerySnapshot(mockContacts);
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockSnapshot),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    (enrichContactFromEmail as jest.Mock).mockRejectedValue(
      new Error("API error")
    );

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId, dryRun: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.processed).toBe(1);
    expect(data.errors).toBe(1);
  });

  it("should not update in dry run mode", async () => {
    const mockContact: Contact = {
      contactId: "contact1",
      primaryEmail: "john.doe@example.com",
      firstName: null,
      lastName: null,
      company: null,
      createdAt: { toDate: () => new Date() },
      updatedAt: { toDate: () => new Date() },
    };

    const mockContacts = [createMockDocSnapshot(mockContact, "contact1")];
    const mockSnapshot = createMockQuerySnapshot(mockContacts);
    const mockDocRef = {
      update: jest.fn().mockResolvedValue(undefined),
    };
    const mockCollection = {
      get: jest.fn().mockResolvedValue(mockSnapshot),
      doc: jest.fn().mockReturnValue(mockDocRef),
    };
    (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

    (enrichContactFromEmail as jest.Mock).mockResolvedValue({
      firstName: "John",
      lastName: "Doe",
      company: null,
      photoUrl: null,
      source: "people_api",
    });

    (isWellFormedName as jest.Mock).mockReturnValue(false);

    const request = new Request("http://localhost:3000/api/admin/enrich-contacts-with-people-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: mockUserId, dryRun: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.dryRun).toBe(true);
    expect(data.updated).toBe(1);
    expect(mockDocRef.update).not.toHaveBeenCalled();
  });
});

