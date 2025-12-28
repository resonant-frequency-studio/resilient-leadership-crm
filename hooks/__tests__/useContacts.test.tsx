import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContacts } from "../useContacts";
import { Contact } from "@/types/firestore";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock getUIMode
jest.mock("@/lib/ui-mode", () => ({
  getUIMode: jest.fn(() => "normal"),
}));

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useContacts", () => {
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
    it("should fetch contacts successfully", async () => {
      const mockContacts: Contact[] = [
        createMockContact({ contactId: "1", firstName: "John" }),
        createMockContact({ contactId: "2", firstName: "Jane" }),
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contacts: mockContacts }),
      } as Response);

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockContacts);
      expect(mockFetch).toHaveBeenCalledWith("/api/contacts", { cache: "no-store" });
    });

    it("should use initialData when provided", () => {
      const initialContacts: Contact[] = [
        createMockContact({ contactId: "1", firstName: "John" }),
      ];

      const { result } = renderHook(
        () => useContacts("user-123", initialContacts),
        { wrapper }
      );

      // Should immediately have data from initialData
      expect(result.current.data).toEqual(initialContacts);
    });

    it("should not fetch when userId is empty", () => {
      const { result } = renderHook(() => useContacts(""), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Error handling", () => {
    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to fetch contacts" }),
      } as Response);

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect((result.current.error as Error).message).toBe("Failed to fetch contacts");
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeInstanceOf(Error);
    });

    it("should handle malformed JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as Response);

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("UI mode overrides", () => {
    it("should return suspense mode when UI mode is 'suspense'", () => {
      const { getUIMode } = require("@/lib/ui-mode");
      getUIMode.mockReturnValueOnce("suspense");

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(true);
    });

    it("should return empty array when UI mode is 'empty'", () => {
      const { getUIMode } = require("@/lib/ui-mode");
      getUIMode.mockReturnValueOnce("empty");

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      expect(result.current.data).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });

    it("should return normal query result when UI mode is 'normal'", async () => {
      const { getUIMode } = require("@/lib/ui-mode");
      getUIMode.mockReturnValueOnce("normal");

      const mockContacts: Contact[] = [createMockContact({ contactId: "1" })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contacts: mockContacts }),
      } as Response);

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockContacts);
    });
  });

  describe("Query options", () => {
    it("should have correct query configuration", async () => {
      const mockContacts: Contact[] = [createMockContact({ contactId: "1" })];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contacts: mockContacts }),
      } as Response);

      const { result } = renderHook(() => useContacts("user-123"), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify fetch was called with no-store cache option
      expect(mockFetch).toHaveBeenCalledWith("/api/contacts", { cache: "no-store" });
    });
  });
});

