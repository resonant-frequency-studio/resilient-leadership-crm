import { getContactFromEmail } from "../../google-people/get-contact-from-email";
import { reportException } from "../../error-reporting";

// Mock fetch
global.fetch = jest.fn();

// Mock error reporting
jest.mock("../../error-reporting", () => ({
  reportException: jest.fn(),
}));

describe("get-contact-from-email", () => {
  const mockAccessToken = "mock-access-token";
  const mockEmail = "john.doe@example.com";

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("getContactFromEmail", () => {
    it("should return contact data from searchContacts", async () => {
      const mockSearchResponse = {
        results: [
          {
            person: {
              resourceName: "people/123",
              names: [
                {
                  givenName: "John",
                  familyName: "Doe",
                },
              ],
              organizations: [
                {
                  name: "Example Corp",
                },
              ],
            },
          },
        ],
      };

      const mockPersonDetailsResponse = {
        resourceName: "people/123",
        names: [
          {
            givenName: "John",
            familyName: "Doe",
          },
        ],
        organizations: [
          {
            name: "Example Corp",
          },
        ],
        photos: [],
      };

      // Mock searchContacts call
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSearchResponse,
      });

      // Mock getPersonDetails call
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPersonDetailsResponse,
      });

      const result = await getContactFromEmail(mockEmail, mockAccessToken);

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: "Example Corp",
        photoUrl: null,
        source: "people_api",
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
        "people.googleapis.com/v1/people:searchContacts"
      );
      expect((global.fetch as jest.Mock).mock.calls[1][0]).toContain(
        "people.googleapis.com/v1/people/123"
      );
    });

    it("should fall back to otherContacts if searchContacts returns 404", async () => {
      const mockSearchResponse = {
        ok: false,
        status: 404,
      };

      const mockOtherContactsResponse = {
        results: [
          {
            person: {
              resourceName: "people/456",
              names: [
                {
                  givenName: "Jane",
                  familyName: "Smith",
                },
              ],
            },
          },
        ],
      };

      const mockPersonDetailsResponse = {
        resourceName: "people/456",
        names: [
          {
            givenName: "Jane",
            familyName: "Smith",
          },
        ],
        photos: [],
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockSearchResponse) // searchContacts returns 404
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockOtherContactsResponse,
        }) // otherContacts.search succeeds
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPersonDetailsResponse,
        }); // getPersonDetails succeeds

      const result = await getContactFromEmail(mockEmail, mockAccessToken);

      expect(result).toEqual({
        firstName: "Jane",
        lastName: "Smith",
        company: null,
        photoUrl: null,
        source: "people_api",
      });

      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it("should return null if contact not found in either source", async () => {
      const mockSearchResponse = {
        ok: false,
        status: 404,
      };

      const mockOtherContactsResponse = {
        ok: false,
        status: 404,
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockSearchResponse)
        .mockResolvedValueOnce(mockOtherContactsResponse);

      const result = await getContactFromEmail(mockEmail, mockAccessToken);

      expect(result).toBeNull();
    });

    it("should return null for invalid email", async () => {
      const result = await getContactFromEmail("notanemail", mockAccessToken);
      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should handle empty results array", async () => {
      const mockResponse = {
        results: [],
      };

      const mockSearchResponse = {
        ok: false,
        status: 404,
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockSearchResponse)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        });

      const result = await getContactFromEmail(mockEmail, mockAccessToken);

      expect(result).toBeNull();
    });

    it("should handle person with no names", async () => {
      const mockSearchResponse = {
        results: [
          {
            person: {
              resourceName: "people/789",
              organizations: [
                {
                  name: "Example Corp",
                },
              ],
            },
          },
        ],
      };

      const mockPersonDetailsResponse = {
        resourceName: "people/789",
        organizations: [
          {
            name: "Example Corp",
          },
        ],
        photos: [],
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPersonDetailsResponse,
        });

      const result = await getContactFromEmail(mockEmail, mockAccessToken);

      expect(result).toEqual({
        firstName: null,
        lastName: null,
        company: "Example Corp",
        photoUrl: null,
        source: "people_api",
      });
    });

    it("should handle API errors and retry with exponential backoff", async () => {
      jest.useFakeTimers();
      
      const mockErrorResponse = {
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
        headers: new Headers(),
      };

      const mockSearchResponse = {
        results: [
          {
            person: {
              resourceName: "people/999",
              names: [
                {
                  givenName: "John",
                  familyName: "Doe",
                },
              ],
            },
          },
        ],
      };

      const mockPersonDetailsResponse = {
        resourceName: "people/999",
        names: [
          {
            givenName: "John",
            familyName: "Doe",
          },
        ],
        photos: [],
      };

      // First call fails with 429, second succeeds
      (global.fetch as jest.Mock)
        .mockImplementationOnce(async () => {
          const error = new Error("People API searchContacts failed: 429 Too Many Requests");
          (error as Error & { response?: Response }).response = mockErrorResponse as Response;
          throw error;
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockSearchResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPersonDetailsResponse,
        });

      const resultPromise = getContactFromEmail(mockEmail, mockAccessToken);
      
      // Fast-forward timers to skip the retry delay
      await jest.runAllTimersAsync();
      
      const result = await resultPromise;

      expect(result).toEqual({
        firstName: "John",
        lastName: "Doe",
        company: null,
        photoUrl: null,
        source: "people_api",
      });

      expect(global.fetch).toHaveBeenCalledTimes(3);
      
      jest.useRealTimers();
    }, 10000);

    it("should throw on authentication errors", async () => {
      const mockErrorResponse = {
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: new Headers(),
      };

      // Mock to throw error on 401 (not handled gracefully like 429)
      (global.fetch as jest.Mock).mockImplementationOnce(async () => {
        const error = new Error("People API searchContacts failed: 401 Unauthorized");
        (error as Error & { response?: Response }).response = mockErrorResponse as Response;
        throw error;
      });

      await expect(
        getContactFromEmail(mockEmail, mockAccessToken)
      ).rejects.toThrow();

      expect(reportException).toHaveBeenCalled();
    });
  });
});

