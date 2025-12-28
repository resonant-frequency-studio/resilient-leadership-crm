import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContact } from "../useContact";
import { Contact } from "@/types/firestore";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock getUIMode
jest.mock("@/lib/ui-mode", () => ({
  getUIMode: jest.fn(() => "normal"),
}));

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useContact", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("Successful fetch", () => {
    it("should fetch contact successfully", async () => {
      const mockContact = createMockContact({ contactId: "contact-1", firstName: "John" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: mockContact }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockContact);
      expect(mockFetch).toHaveBeenCalledWith("/api/contacts/contact-1");
    });

    it("should encode contactId in URL", async () => {
      const mockContact = createMockContact({ contactId: "contact with spaces" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: mockContact }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact with spaces"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledWith("/api/contacts/contact%20with%20spaces");
    });

    it("should return null for 404 responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "non-existent"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeNull();
    });
  });

  describe("Placeholder data", () => {
    it("should use placeholder data from contacts list cache", async () => {
      const mockContact = createMockContact({ contactId: "contact-1", firstName: "John" });
      const mockContacts = [mockContact];

      // Set up contacts list cache
      queryClient.setQueryData(["contacts", "user-123"], mockContacts);

      // Mock the API call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: mockContact }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      // Should immediately have placeholder data
      expect(result.current.data).toEqual(mockContact);
    });

    it("should prefer individual contact cache over list cache", async () => {
      const cachedContact = createMockContact({
        contactId: "contact-1",
        firstName: "Cached",
      });
      const listContact = createMockContact({
        contactId: "contact-1",
        firstName: "From List",
      });

      // Set up both caches
      queryClient.setQueryData(["contact", "user-123", "contact-1"], cachedContact);
      queryClient.setQueryData(["contacts", "user-123"], [listContact]);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: cachedContact }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      // Should use individual contact cache
      expect(result.current.data).toEqual(cachedContact);
    });
  });

  describe("Error handling", () => {
    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe("Internal server error");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it("should handle malformed JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("Query enabled state", () => {
    it("should not fetch when userId is empty", () => {
      const { result } = renderHook(() => useContact("", "contact-1"), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should not fetch when contactId is empty", () => {
      const { result } = renderHook(() => useContact("user-123", ""), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should fetch when both userId and contactId are provided", async () => {
      const mockContact = createMockContact({ contactId: "contact-1" });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: mockContact }),
      } as Response);

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("UI mode overrides", () => {
    it("should return suspense mode when UI mode is 'suspense'", () => {
      const { getUIMode } = require("@/lib/ui-mode");
      getUIMode.mockReturnValueOnce("suspense");

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });

    it("should return undefined data when UI mode is 'empty'", () => {
      const { getUIMode } = require("@/lib/ui-mode");
      getUIMode.mockReturnValueOnce("empty");

      const { result } = renderHook(
        () => useContact("user-123", "contact-1"),
        { wrapper }
      );

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});

