// Mock dependencies before importing
jest.mock("../../gmail/get-access-token");
jest.mock("../../google-people/get-contact-from-email");
jest.mock("../../error-reporting", () => ({
  reportException: jest.fn(),
  ErrorLevel: {
    DEBUG: "debug",
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
    FATAL: "fatal",
  },
}));
jest.mock("@/lib/firebase-admin", () => ({
  adminDb: {},
}));

import { enrichContactFromEmail } from "../../google-people/enrich-contact-from-email";
import { getAccessToken } from "../../gmail/get-access-token";
import { getContactFromEmail } from "../../google-people/get-contact-from-email";
import { reportException } from "../../error-reporting";

describe("enrich-contact-from-email", () => {
  const mockUserId = "user123";
  const mockEmail = "john.doe@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("enrichContactFromEmail", () => {
    it("should return People API data when available", async () => {
      const mockAccessToken = "mock-token";
      const mockPeopleApiData = {
        firstName: "John",
        lastName: "Doe",
        company: "Example Corp",
        photoUrl: null,
        source: "people_api" as const,
      };

      (getAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
      (getContactFromEmail as jest.Mock).mockResolvedValue(mockPeopleApiData);

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual(mockPeopleApiData);
      expect(getAccessToken).toHaveBeenCalledWith(mockUserId);
      expect(getContactFromEmail).toHaveBeenCalledWith(mockEmail, mockAccessToken);
    });

    it("should fall back to email extraction when People API returns no name", async () => {
      const mockAccessToken = "mock-token";
      const mockPeopleApiData = {
        firstName: null,
        lastName: null,
        company: "Example Corp",
        photoUrl: null,
        source: "people_api" as const,
      };

      (getAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
      (getContactFromEmail as jest.Mock).mockResolvedValue(mockPeopleApiData);

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: "Example Corp",
        photoUrl: null,
        source: "email_extraction",
      });
    });

    it("should fall back to email extraction when People API returns null", async () => {
      const mockAccessToken = "mock-token";

      (getAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
      (getContactFromEmail as jest.Mock).mockResolvedValue(null);

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "email_extraction",
      });
    });

    it("should fall back to email extraction when no Google account linked", async () => {
      (getAccessToken as jest.Mock).mockRejectedValue(
        new Error("No Gmail account linked.")
      );

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "email_extraction",
      });

      expect(reportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          level: "warning",
        })
      );
    });

    it("should fall back to email extraction on invalid token", async () => {
      (getAccessToken as jest.Mock).mockRejectedValue(
        new Error("invalid_grant")
      );

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "email_extraction",
      });
    });

    it("should fall back to email extraction on API errors", async () => {
      const mockAccessToken = "mock-token";

      (getAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
      (getContactFromEmail as jest.Mock).mockRejectedValue(
        new Error("Network error")
      );

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "email_extraction",
      });

      expect(reportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          level: "warning",
        })
      );
    });

    it("should handle invalid email address", async () => {
      const result = await enrichContactFromEmail("notanemail", mockUserId);

      expect(result).toEqual({
        firstName: null,
        lastName: null,
        company: null,
        photoUrl: null,
        source: "email_extraction",
      });

      expect(getAccessToken).not.toHaveBeenCalled();
    });

    it("should merge People API lastName with email extraction firstName", async () => {
      const mockAccessToken = "mock-token";
      const mockPeopleApiData = {
        firstName: null,
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "people_api" as const,
      };

      (getAccessToken as jest.Mock).mockResolvedValue(mockAccessToken);
      (getContactFromEmail as jest.Mock).mockResolvedValue(mockPeopleApiData);

      const result = await enrichContactFromEmail(mockEmail, mockUserId);

      // Should merge People API lastName with email extraction firstName
      // Source should be people_api since People API provided lastName
      expect(result).toEqual({
        firstName: "John", // From email extraction
        lastName: "Doe", // From People API
        company: null,
        photoUrl: null,
        source: "people_api", // Since People API provided lastName
      });
    });
  });
});

