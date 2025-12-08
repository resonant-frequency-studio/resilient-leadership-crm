import { getDashboardStats } from "../dashboard-stats-server";
import { getAllContactsForUser } from "../contacts-server";
import { Contact } from "@/types/firestore";

// Mock the contacts-server module
jest.mock("../contacts-server", () => ({
  getAllContactsForUser: jest.fn(),
}));

// Mock error reporting
jest.mock("../error-reporting", () => ({
  reportException: jest.fn(),
}));

describe("dashboard-stats-server", () => {
  const mockUserId = "user123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should calculate stats with empty contacts array", async () => {
    (getAllContactsForUser as jest.Mock).mockResolvedValue([]);

    const result = await getDashboardStats(mockUserId);

    expect(result).toEqual({
      totalContacts: 0,
      contactsWithEmail: 0,
      contactsWithThreads: 0,
      averageEngagementScore: 0,
      segmentDistribution: {},
      leadSourceDistribution: {},
      tagDistribution: {},
      sentimentDistribution: {},
      engagementLevels: {
        high: 0,
        medium: 0,
        low: 0,
        none: 0,
      },
      upcomingTouchpoints: 0,
    });
  });

  it("should calculate stats with various contact data", async () => {
    const mockContacts: Contact[] = [
      {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        engagementScore: 80,
        segment: "Enterprise",
        leadSource: "Website",
        tags: ["VIP", "Enterprise"],
        sentiment: "Positive",
        threadCount: 5,
        nextTouchpointDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        engagementScore: 50,
        segment: "SMB",
        leadSource: "Referral",
        tags: ["SMB"],
        sentiment: "Neutral",
        threadCount: 2,
        nextTouchpointDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday (past)
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact3",
        primaryEmail: "test3@example.com",
        engagementScore: 30,
        segment: "Enterprise",
        leadSource: "Unknown",
        tags: [],
        sentiment: "Negative",
        threadCount: 0,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact4",
        primaryEmail: "",
        engagementScore: 0,
        segment: "",
        leadSource: "",
        tags: [],
        sentiment: "",
        threadCount: 0,
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
    ];

    (getAllContactsForUser as jest.Mock).mockResolvedValue(mockContacts);

    const result = await getDashboardStats(mockUserId);

    expect(result.totalContacts).toBe(4);
    expect(result.contactsWithEmail).toBe(3); // contact4 has empty email
    expect(result.contactsWithThreads).toBe(2); // contact1 and contact2 have threads
    expect(result.averageEngagementScore).toBe(40); // (80 + 50 + 30 + 0) / 4 = 40
    expect(result.segmentDistribution["Enterprise"]).toBe(2);
    expect(result.segmentDistribution["SMB"]).toBe(1);
    expect(result.segmentDistribution["Uncategorized"]).toBe(1);
    expect(result.leadSourceDistribution["Website"]).toBe(1);
    expect(result.leadSourceDistribution["Referral"]).toBe(1);
    expect(result.leadSourceDistribution["Unknown"]).toBe(2);
    expect(result.tagDistribution["VIP"]).toBe(1);
    expect(result.tagDistribution["Enterprise"]).toBe(1);
    expect(result.tagDistribution["SMB"]).toBe(1);
    expect(result.sentimentDistribution["Positive"]).toBe(1);
    expect(result.sentimentDistribution["Neutral"]).toBe(2); // contact2 and contact4 (empty string)
    expect(result.sentimentDistribution["Negative"]).toBe(1);
    expect(result.engagementLevels.high).toBe(1); // contact1 (80)
    expect(result.engagementLevels.medium).toBe(1); // contact2 (50)
    expect(result.engagementLevels.low).toBe(1); // contact3 (30)
    expect(result.engagementLevels.none).toBe(1); // contact4 (0)
    expect(result.upcomingTouchpoints).toBe(1); // Only contact1 has future touchpoint
  });

  it("should normalize segment prefixes", async () => {
    const mockContacts: Contact[] = [
      {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        segment: "Segment: Enterprise",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        segment: "Enterprise",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
    ];

    (getAllContactsForUser as jest.Mock).mockResolvedValue(mockContacts);

    const result = await getDashboardStats(mockUserId);

    // Both should be counted under "Enterprise" (prefix removed)
    expect(result.segmentDistribution["Enterprise"]).toBe(2);
  });

  it("should normalize sentiment values", async () => {
    const mockContacts: Contact[] = [
      {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        sentiment: "Sentiment: Very Positive",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        sentiment: "positive",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
      {
        contactId: "contact3",
        primaryEmail: "test3@example.com",
        sentiment: "very negative",
        createdAt: new Date("2024-01-01").toISOString(),
        updatedAt: new Date("2024-01-02").toISOString(),
      },
    ];

    (getAllContactsForUser as jest.Mock).mockResolvedValue(mockContacts);

    const result = await getDashboardStats(mockUserId);

    expect(result.sentimentDistribution["Very Positive"]).toBe(1);
    expect(result.sentimentDistribution["Positive"]).toBe(1);
    expect(result.sentimentDistribution["Very Negative"]).toBe(1);
  });

  it("should handle errors from getAllContactsForUser", async () => {
    const error = new Error("Database error");
    (getAllContactsForUser as jest.Mock).mockRejectedValue(error);

    await expect(getDashboardStats(mockUserId)).rejects.toThrow("Database error");
  });
});

