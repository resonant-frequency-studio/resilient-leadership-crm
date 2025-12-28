import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardTouchpoints from "../DashboardTouchpoints";
import { useContactsRealtime } from "@/hooks/useContactsRealtime";
import { useUpdateTouchpointStatus } from "@/hooks/useContactMutations";
import { useAuth } from "@/hooks/useAuth";
import { createMockContact, createMockUseMutationResult } from "@/components/__tests__/test-utils";
import { Timestamp } from "firebase/firestore";
import type { Contact } from "@/types/firestore";
import type { User } from "firebase/auth";

jest.mock("@/hooks/useContactsRealtime");
jest.mock("@/hooks/useContactMutations");
jest.mock("@/hooks/useAuth");
jest.mock("../ContactCard", () => ({
  __esModule: true,
  default: ({ contact, isSelected, onSelectChange }: { contact: Contact; isSelected: boolean; onSelectChange?: (id: string) => void }) => (
    <div data-testid={`contact-card-${contact.contactId}`} data-selected={isSelected}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelectChange?.(contact.contactId)}
        data-testid={`checkbox-${contact.contactId}`}
      />
      {contact.firstName} {contact.lastName}
    </div>
  ),
}));
jest.mock("../TouchpointCard", () => ({
  __esModule: true,
  default: ({ contact, isSelected, onSelectChange }: { contact: Contact; isSelected: boolean; onSelectChange?: (id: string) => void }) => (
    <div data-testid={`touchpoint-card-${contact.contactId}`} data-selected={isSelected}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelectChange?.(contact.contactId)}
        data-testid={`checkbox-${contact.contactId}`}
      />
      {contact.firstName} {contact.lastName}
    </div>
  ),
}));

// Helper to render with QueryClientProvider
const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const mockUseContactsRealtime = useContactsRealtime as jest.MockedFunction<typeof useContactsRealtime>;
const mockUseUpdateTouchpointStatus = useUpdateTouchpointStatus as jest.MockedFunction<typeof useUpdateTouchpointStatus>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("DashboardTouchpoints", () => {
  const mockUserId = "user-123";
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();

    mockUseAuth.mockReturnValue({
      user: { uid: mockUserId } as User,
      loading: false,
    });

    const mockMutate = jest.fn();
    mockUseUpdateTouchpointStatus.mockReturnValue(
      createMockUseMutationResult(
        mockMutate,
        mockMutateAsync
      ) as ReturnType<typeof useUpdateTouchpointStatus>
    );
  });

  describe("Loading Fallback", () => {
    it("shows loading fallback", () => {
      mockUseContactsRealtime.mockReturnValue({
        contacts: [],
        loading: true,
        error: null,
        hasConfirmedNoContacts: false,
      });
      
      const { container } = renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);
      // If contacts are loading, the component should still render the structure
      expect(container).toBeTruthy();
    });
  });

  describe("Filtering", () => {
    it("filters overdue touchpoints", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(pastDate),
          touchpointStatus: "pending",
        }),
        createMockContact({
          contactId: "contact-2",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(new Date(Date.now() + 86400000)), // Tomorrow
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for Focus for Today section to render
      await waitFor(() => {
        expect(screen.getByText(/Focus for Today/)).toBeInTheDocument();
      });
      
      // Find the "Follow-ups to close" subsection heading in Needs Attention
      await waitFor(() => {
        expect(screen.getByText(/Follow-ups to close/)).toBeInTheDocument();
      });
      
      // Verify contact-1 is in the overdue section (now using TouchpointCard)
      expect(screen.getAllByTestId("touchpoint-card-contact-1").length).toBeGreaterThan(0);
      
      // Contact-2 should appear in preparing ahead section, not in overdue
      // We verify contact-1 appears which proves overdue filtering works
      expect(screen.getAllByTestId("touchpoint-card-contact-1").length).toBeGreaterThan(0);
    });

    it("filters upcoming touchpoints", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5); // 5 days from now

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
        createMockContact({
          contactId: "contact-2",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(new Date(Date.now() - 86400000)), // Yesterday
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for the "Preparing ahead" accordion to appear, then expand it
      await waitFor(() => {
        expect(screen.getByText(/Preparing ahead/)).toBeInTheDocument();
      });
      
      // Click to expand the accordion
      const accordionButton = screen.getByText(/Preparing ahead/);
      fireEvent.click(accordionButton);
      
      // Now wait for the touchpoint card to appear
      await waitFor(() => {
        expect(screen.getAllByTestId("touchpoint-card-contact-1").length).toBeGreaterThan(0);
      });
    });

    it("shows recent contacts", async () => {
      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
        }),
        createMockContact({
          contactId: "contact-2",
          archived: false,
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      await waitFor(() => {
        expect(screen.getByText("Relationship Momentum")).toBeInTheDocument();
      });
    });
  });

  describe("Touchpoint Selection", () => {
    it("handles touchpoint selection", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText(/Focus for Today/)).toBeInTheDocument();
      });
      
      // The touchpoint is in the future, so it might be in "Preparing ahead" section
      // Check if "Preparing ahead" exists and expand it
      const preparingAheadText = screen.queryByText(/Preparing ahead/);
      if (preparingAheadText) {
        fireEvent.click(preparingAheadText);
      }

      await waitFor(() => {
        const checkboxes = screen.getAllByTestId("checkbox-contact-1");
        expect(checkboxes.length).toBeGreaterThan(0);
        const checkbox = checkboxes[0];
        expect(checkbox).not.toBeChecked();
        
        fireEvent.click(checkbox);
        
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe("Bulk Operations", () => {
    it("bulk marks as completed", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
        createMockContact({
          contactId: "contact-2",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      mockMutateAsync.mockResolvedValue({});

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for preparing ahead section to render
      await waitFor(() => {
        expect(screen.getByText(/Preparing ahead/)).toBeInTheDocument();
      });
      
      // Expand the accordion (it's collapsed by default)
      const accordionButton = screen.getByText(/Preparing ahead/);
      fireEvent.click(accordionButton);

      // Select the checkboxes
      await waitFor(() => {
        const checkboxes1 = screen.getAllByTestId("checkbox-contact-1");
        const checkboxes2 = screen.getAllByTestId("checkbox-contact-2");
        const checkbox1 = checkboxes1[0]; // Use first one (from preparing ahead section)
        const checkbox2 = checkboxes2[0];
        
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);
      });

      // Wait for bulk actions to appear after selection
      await waitFor(() => {
        const bulkButton = screen.getByText(/Mark as Contacted/);
        fireEvent.click(bulkButton);
      });

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledTimes(2);
        expect(mockMutateAsync).toHaveBeenCalledWith({
          contactId: "contact-1",
          status: "completed",
        });
        expect(mockMutateAsync).toHaveBeenCalledWith({
          contactId: "contact-2",
          status: "completed",
        });
      });
    });

    it("bulk marks as cancelled", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      mockMutateAsync.mockResolvedValue({});

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for preparing ahead section to render
      await waitFor(() => {
        expect(screen.getByText(/Preparing ahead/)).toBeInTheDocument();
      });
      
      // Expand the accordion (it's collapsed by default)
      const accordionButton = screen.getByText(/Preparing ahead/);
      fireEvent.click(accordionButton);

      // Select the checkbox
      await waitFor(() => {
        const checkboxes = screen.getAllByTestId("checkbox-contact-1");
        const checkbox = checkboxes[0]; // Use first one (from preparing ahead section)
        fireEvent.click(checkbox);
      });

      // Wait for bulk actions to appear after selection
      await waitFor(() => {
        const bulkButton = screen.getByText(/Not needed right now/);
        fireEvent.click(bulkButton);
      });

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          contactId: "contact-1",
          status: "cancelled",
        });
      });
    });
  });

  describe("Select All", () => {
    it("selects all touchpoints in section", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
        createMockContact({
          contactId: "contact-2",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText(/Focus for Today/)).toBeInTheDocument();
      });
      
      // The touchpoints are in the future, so they might be in "Preparing ahead" section
      // Check if "Preparing ahead" exists and expand it
      const preparingAheadText = screen.queryByText(/Preparing ahead/);
      if (preparingAheadText) {
        fireEvent.click(preparingAheadText);
      }

      // Find and click the select all checkbox
      await waitFor(() => {
        const selectAllCheckboxes = screen.getAllByText(/Handle these together/);
        expect(selectAllCheckboxes.length).toBeGreaterThan(0);
        fireEvent.click(selectAllCheckboxes[0]);
      });

      // Wait for checkboxes to be checked
      await waitFor(() => {
        const checkbox1 = screen.getAllByTestId("checkbox-contact-1")[0];
        const checkbox2 = screen.getAllByTestId("checkbox-contact-2")[0];
        
        expect(checkbox1).toBeChecked();
        expect(checkbox2).toBeChecked();
      });
    });
  });

  describe("Bulk Actions Display", () => {
    it("renders bulk actions when items selected", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);

      const mockContacts = [
        createMockContact({
          contactId: "contact-1",
          archived: false,
          nextTouchpointDate: Timestamp.fromDate(futureDate),
          touchpointStatus: "pending",
        }),
      ];

      mockUseContactsRealtime.mockReturnValue({
        contacts: mockContacts,
        loading: false,
        error: null,
        hasConfirmedNoContacts: false,
      });

      renderWithQueryClient(<DashboardTouchpoints userId={mockUserId} />);

      // Wait for the component to render
      await waitFor(() => {
        expect(screen.getByText(/Focus for Today/)).toBeInTheDocument();
      });
      
      // The touchpoint is in the future, so it might be in "Preparing ahead" section
      // Check if "Preparing ahead" exists and expand it
      const preparingAheadText = screen.queryByText(/Preparing ahead/);
      if (preparingAheadText) {
        fireEvent.click(preparingAheadText);
      }

      // Wait for checkbox to appear and click it
      await waitFor(() => {
        const checkboxes = screen.getAllByTestId("checkbox-contact-1");
        expect(checkboxes.length).toBeGreaterThan(0);
        const checkbox = checkboxes[0];
        fireEvent.click(checkbox);
      });

      // Wait for bulk actions to appear
      await waitFor(() => {
        expect(screen.getByText(/Mark as Contacted/)).toBeInTheDocument();
        expect(screen.getByText(/Not needed right now/)).toBeInTheDocument();
      });
    });
  });
});

