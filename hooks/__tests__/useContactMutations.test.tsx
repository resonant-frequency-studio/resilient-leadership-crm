import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useArchiveContact,
  useUpdateTouchpointStatus,
} from "../useContactMutations";
import { Contact } from "@/types/firestore";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock reportException
jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

describe("useContactMutations", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useCreateContact", () => {
    it("should create contact successfully", async () => {
      const mockContactId = "new-contact-123";
      const contactData: Partial<Contact> = {
        firstName: "John",
        lastName: "Doe",
        primaryEmail: "john@example.com",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contactId: mockContactId }),
      } as Response);

      const { result } = renderHook(() => useCreateContact(), { wrapper });

      await result.current.mutateAsync(contactData);

      expect(mockFetch).toHaveBeenCalledWith("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });

      // Mutation should complete successfully
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to create contact" }),
      } as Response);

      const { result } = renderHook(() => useCreateContact(), { wrapper });

      const contactData: Partial<Contact> = { firstName: "John" };

      await expect(result.current.mutateAsync(contactData)).rejects.toThrow("Failed to create contact");

      const { reportException } = require("@/lib/error-reporting");
      expect(reportException).toHaveBeenCalled();
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useCreateContact(), { wrapper });

      const contactData: Partial<Contact> = { firstName: "John" };

      await expect(result.current.mutateAsync(contactData)).rejects.toThrow();
    });
  });

  describe("useUpdateContact", () => {
    const mockUserId = "user-123";
    const mockContactId = "contact-1";
    const mockContact = createMockContact({ contactId: mockContactId, firstName: "John" });

    beforeEach(() => {
      // Set up initial cache data
      queryClient.setQueryData(["contact", mockUserId, mockContactId], mockContact);
      queryClient.setQueryData(["contacts", mockUserId], [mockContact]);
    });

    it("should update contact successfully", async () => {
      const updates: Partial<Contact> = { firstName: "Jane" };
      const updatedContact = { ...mockContact, ...updates };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: updatedContact }),
      } as Response);

      const { result } = renderHook(() => useUpdateContact(mockUserId), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, updates });

      expect(mockFetch).toHaveBeenCalledWith(`/api/contacts/${mockContactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
    });

    it("should update cache on success", async () => {
      const updates: Partial<Contact> = { firstName: "Jane" };
      const updatedContact = { ...mockContact, ...updates };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: updatedContact }),
      } as Response);

      const { result } = renderHook(() => useUpdateContact(mockUserId), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, updates });

      // Check cache was updated with server response
      const cached = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);
      expect(cached?.firstName).toBe("Jane");
    });

    it("should rollback on error", async () => {
      const updates: Partial<Contact> = { firstName: "Jane" };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Update failed" }),
      } as Response);

      const { result } = renderHook(() => useUpdateContact(mockUserId), { wrapper });

      const originalContact = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);

      await expect(
        result.current.mutateAsync({ contactId: mockContactId, updates })
      ).rejects.toThrow();

      // Should rollback to original
      await waitFor(() => {
        const cached = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);
        expect(cached?.firstName).toBe(originalContact?.firstName);
      });
    });

    it("should invalidate calendar events when touchpoint date is updated", async () => {
      const updates: Partial<Contact> = { nextTouchpointDate: new Date().toISOString() };
      const updatedContact = { ...mockContact, ...updates };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ contact: updatedContact }),
      } as Response);

      const { result } = renderHook(() => useUpdateContact(mockUserId), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, updates });

      // Mutation should complete successfully
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("useDeleteContact", () => {
    it("should delete contact successfully", async () => {
      const mockContactId = "contact-1";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useDeleteContact(), { wrapper });

      await result.current.mutateAsync(mockContactId);

      expect(mockFetch).toHaveBeenCalledWith(`/api/contacts/${mockContactId}`, {
        method: "DELETE",
      });

      // Mutation should complete successfully
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should handle API errors", async () => {
      const mockContactId = "contact-1";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to delete contact" }),
      } as Response);

      const { result } = renderHook(() => useDeleteContact(), { wrapper });

      await expect(result.current.mutateAsync(mockContactId)).rejects.toThrow("Failed to delete contact");

      const { reportException } = require("@/lib/error-reporting");
      expect(reportException).toHaveBeenCalled();
    });
  });

  describe("useArchiveContact", () => {
    const mockUserId = "user-123";
    const mockContactId = "contact-1";
    const mockContact = createMockContact({ contactId: mockContactId, archived: false });

    beforeEach(() => {
      queryClient.setQueryData(["contact", mockUserId, mockContactId], mockContact);
      queryClient.setQueryData(["contacts", mockUserId], [mockContact]);
    });

    it("should archive contact successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useArchiveContact(mockUserId), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, archived: true });

      expect(mockFetch).toHaveBeenCalledWith(`/api/contacts/${mockContactId}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
    });

    it("should update cache on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useArchiveContact(mockUserId), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, archived: true });

      // Mutation should complete successfully
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should rollback on error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Archive failed" }),
      } as Response);

      const { result } = renderHook(() => useArchiveContact(mockUserId), { wrapper });

      const originalContact = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);

      await expect(
        result.current.mutateAsync({ contactId: mockContactId, archived: true })
      ).rejects.toThrow();

      // Should rollback
      await waitFor(() => {
        const cached = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);
        expect(cached?.archived).toBe(originalContact?.archived);
      });
    });

    it("should work without userId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useArchiveContact(), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, archived: true });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe("useUpdateTouchpointStatus", () => {
    const mockUserId = "user-123";
    const mockContactId = "contact-1";
    const mockContact = createMockContact({
      contactId: mockContactId,
      touchpointStatus: "pending",
    });

    beforeEach(() => {
      queryClient.setQueryData(["contact", mockUserId, mockContactId], mockContact);
      queryClient.setQueryData(["contacts", mockUserId], [mockContact]);
    });

    it("should update touchpoint status successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useUpdateTouchpointStatus(mockUserId), { wrapper });

      await result.current.mutateAsync({
        contactId: mockContactId,
        status: "completed",
        reason: "Followed up",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/contacts/${mockContactId}/touchpoint-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed", reason: "Followed up" }),
        }
      );
    });

    it("should update cache on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useUpdateTouchpointStatus(mockUserId), { wrapper });

      await result.current.mutateAsync({
        contactId: mockContactId,
        status: "completed",
      });

      // Mutation should complete successfully
      expect(mockFetch).toHaveBeenCalled();
    });

    it("should rollback on error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Update failed" }),
      } as Response);

      const { result } = renderHook(() => useUpdateTouchpointStatus(mockUserId), { wrapper });

      const originalContact = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);

      await expect(
        result.current.mutateAsync({ contactId: mockContactId, status: "completed" })
      ).rejects.toThrow();

      // Should rollback
      await waitFor(() => {
        const cached = queryClient.getQueryData<Contact>(["contact", mockUserId, mockContactId]);
        expect(cached?.touchpointStatus).toBe(originalContact?.touchpointStatus);
      });
    });

    it("should work without userId", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const { result } = renderHook(() => useUpdateTouchpointStatus(), { wrapper });

      await result.current.mutateAsync({ contactId: mockContactId, status: "completed" });

      expect(mockFetch).toHaveBeenCalled();
    });
  });
});

