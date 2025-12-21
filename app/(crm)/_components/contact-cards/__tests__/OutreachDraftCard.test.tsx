import { screen, fireEvent, waitFor } from "@testing-library/react";
import OutreachDraftCard from "../OutreachDraftCard";
import { useContact } from "@/hooks/useContact";
import { useUpdateContact } from "@/hooks/useContactMutations";
import { useSavingState } from "@/contexts/SavingStateContext";
import { renderWithProviders, createMockContact, createMockUseQueryResult, createMockUseMutationResult } from "@/components/__tests__/test-utils";
import type { Contact } from "@/types/firestore";
import type { SavingStateContextType } from "@/contexts/SavingStateContext";

jest.mock("@/hooks/useContact");
jest.mock("@/hooks/useContactMutations");
jest.mock("@/contexts/SavingStateContext");

const mockUseContact = useContact as jest.MockedFunction<typeof useContact>;
const mockUseUpdateContact = useUpdateContact as jest.MockedFunction<typeof useUpdateContact>;
const mockUseSavingState = useSavingState as jest.MockedFunction<typeof useSavingState>;

describe("OutreachDraftCard", () => {
  const mockUserId = "user-123";
  const mockContactId = "contact-123";
  const mockMutate = jest.fn();
  const mockRegisterSaveStatus = jest.fn();
  const mockUnregisterSaveStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseSavingState.mockReturnValue({
      isSaving: false,
      registerSaveStatus: mockRegisterSaveStatus,
      unregisterSaveStatus: mockUnregisterSaveStatus,
    } as SavingStateContextType);

    mockUseUpdateContact.mockReturnValue(
      createMockUseMutationResult<Contact, Error, { contactId: string; updates: Partial<Contact> }, { prevDetail?: Contact | undefined; prevLists: Record<string, Contact[]> }>(
        mockMutate,
        jest.fn(),
        false,
        false,
        false,
        null,
        undefined
      ) as ReturnType<typeof useUpdateContact>
    );
  });

  describe("Loading State", () => {
    it("shows loading state when contact is not loaded", () => {
      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(undefined, true, null)
      );

      const { container } = renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
    });
  });

  describe("Initialization", () => {
    it("initializes draft from contact data", async () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft text",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      const textarea = screen.getByPlaceholderText("Write your outreach draft here...") as HTMLTextAreaElement;
      await waitFor(() => {
        expect(textarea.value).toBe("Initial draft text");
      });
    });

    it("initializes with empty string when draft is null", async () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: null,
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      const textarea = screen.getByPlaceholderText("Write your outreach draft here...") as HTMLTextAreaElement;
      await waitFor(() => {
        expect(textarea.value).toBe("");
      });
    });
  });

  describe("User Interactions", () => {
    it("updates draft on textarea change", () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      const textarea = screen.getByPlaceholderText("Write your outreach draft here...") as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "Updated draft text" } });
      
      expect(textarea.value).toBe("Updated draft text");
    });

    it("calls autosave on blur after textarea change", async () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
        expect(textarea).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
      fireEvent.change(textarea, { target: { value: "Updated draft" } });
      
      fireEvent.blur(textarea);
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
      });
    });

    it("does not call save when there are no changes", () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      // Verify that mutate is not called when there are no changes
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe("Save Functionality", () => {
    it("calls update mutation with correct data on save", async () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
        expect(textarea).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
      fireEvent.change(textarea, { target: { value: "Updated draft text" } });

      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          {
            contactId: mockContactId,
            updates: {
              outreachDraft: "Updated draft text",
            },
          },
          expect.any(Object)
        );
      });
    });

    it("saves null when draft is empty", async () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
        outreachDraft: "Initial draft",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      await waitFor(() => {
        const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
        expect(textarea).toBeInTheDocument();
      });

      const textarea = screen.getByPlaceholderText("Write your outreach draft here...");
      fireEvent.change(textarea, { target: { value: "" } });

      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          {
            contactId: mockContactId,
            updates: {
              outreachDraft: null,
            },
          },
          expect.any(Object)
        );
      });
    });
  });

  // Note: Save status is now handled globally by ContactSaveBar, not per-card
  // The "only saves when there are unsaved changes" test is covered by the autosave behavior tests above

  describe("State Reset", () => {
    it("resets state when contactId changes", () => {
      const mockContact1 = createMockContact({
        contactId: "contact-1",
        outreachDraft: "Draft 1",
      });

      const mockContact2 = createMockContact({
        contactId: "contact-2",
        outreachDraft: "Draft 2",
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact1, false, null)
      );

      const { rerender } = renderWithProviders(<OutreachDraftCard contactId="contact-1" userId={mockUserId} />);
      
      const textarea = screen.getByPlaceholderText("Write your outreach draft here...") as HTMLTextAreaElement;
      expect(textarea.value).toBe("Draft 1");

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact2, false, null)
      );

      rerender(<OutreachDraftCard contactId="contact-2" userId={mockUserId} />);
      
      expect(textarea.value).toBe("Draft 2");
    });
  });

  describe("Descriptive Text", () => {
    it("renders descriptive text", () => {
      const mockContact = createMockContact({
        contactId: mockContactId,
      });

      mockUseContact.mockReturnValue(
        createMockUseQueryResult<Contact | null, Error>(mockContact, false, null)
      );

      renderWithProviders(<OutreachDraftCard contactId={mockContactId} userId={mockUserId} />);
      
      expect(screen.getByText(/Draft and refine your email messages/)).toBeInTheDocument();
    });
  });
});

