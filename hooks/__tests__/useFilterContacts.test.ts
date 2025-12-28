import { renderHook, act, waitFor } from "@testing-library/react";
import { useFilterContacts } from "../useFilterContacts";
import { createMockContact } from "@/components/__tests__/test-utils";
import { Contact } from "@/types/firestore";

interface ContactWithId extends Contact {
  id: string;
}

describe("useFilterContacts - Focus Filter", () => {
  const createContact = (overrides: Partial<Contact> = {}): ContactWithId => {
    const contact = createMockContact(overrides);
    return {
      ...contact,
      id: contact.contactId,
    };
  };

  describe("Focus: All", () => {
    it("should show all contacts when focus is 'all'", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal" }),
        createContact({ contactId: "2", segment: "Work" }),
        createContact({ contactId: "3", segment: "Enterprise" }),
        createContact({ contactId: "4" }), // No segment
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("all");
      });

      expect(result.current.filteredContacts).toHaveLength(4);
      expect(result.current.filteredContacts.map((c) => c.id)).toEqual(["1", "2", "3", "4"]);
    });

    it("should not mark 'all' as an active filter", () => {
      const contacts: ContactWithId[] = [createContact({ contactId: "1" })];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("all");
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe("Focus: Personal", () => {
    it("should show only contacts with 'Personal' segment", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal" }),
        createContact({ contactId: "2", segment: "Work" }),
        createContact({ contactId: "3", segment: "Personal" }),
        createContact({ contactId: "4" }), // No segment
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
      });

      expect(result.current.filteredContacts).toHaveLength(2);
      expect(result.current.filteredContacts.map((c) => c.id)).toEqual(["1", "3"]);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("should work with archived contacts", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", archived: true }),
        createContact({ contactId: "2", segment: "Personal", archived: false }),
        createContact({ contactId: "3", segment: "Work", archived: true }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
        result.current.setShowArchived(true);
      });

      // Should show only archived Personal contacts
      expect(result.current.filteredContacts).toHaveLength(1);
      expect(result.current.filteredContacts[0].id).toBe("1");
    });

    it("should work with unarchived contacts", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", archived: true }),
        createContact({ contactId: "2", segment: "Personal", archived: false }),
        createContact({ contactId: "3", segment: "Work", archived: false }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
        result.current.setShowArchived(false);
      });

      // Should show only unarchived Personal contacts
      expect(result.current.filteredContacts).toHaveLength(1);
      expect(result.current.filteredContacts[0].id).toBe("2");
    });
  });

  describe("Focus: Work", () => {
    it("should show contacts that do NOT have 'Personal' segment", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal" }),
        createContact({ contactId: "2", segment: "Work" }),
        createContact({ contactId: "3", segment: "Enterprise" }),
        createContact({ contactId: "4" }), // No segment
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("work");
      });

      expect(result.current.filteredContacts).toHaveLength(3);
      expect(result.current.filteredContacts.map((c) => c.id)).toEqual(["2", "3", "4"]);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("should work with archived contacts", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", archived: true }),
        createContact({ contactId: "2", segment: "Work", archived: true }),
        createContact({ contactId: "3", segment: "Enterprise", archived: true }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("work");
        result.current.setShowArchived(true);
      });

      // Should show archived Work and Enterprise contacts (not Personal)
      expect(result.current.filteredContacts).toHaveLength(2);
      expect(result.current.filteredContacts.map((c) => c.id)).toEqual(["2", "3"]);
    });

    it("should work with unarchived contacts", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", archived: false }),
        createContact({ contactId: "2", segment: "Work", archived: false }),
        createContact({ contactId: "3", segment: "Enterprise", archived: false }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("work");
        result.current.setShowArchived(false);
      });

      // Should show unarchived Work and Enterprise contacts (not Personal)
      expect(result.current.filteredContacts).toHaveLength(2);
      expect(result.current.filteredContacts.map((c) => c.id)).toEqual(["2", "3"]);
    });
  });

  describe("Focus filter with other filters", () => {
    it("should apply focus filter first, then other filters", async () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", firstName: "John" }),
        createContact({ contactId: "2", segment: "Personal", firstName: "Jane" }),
        createContact({ contactId: "3", segment: "Work", firstName: "John" }),
        createContact({ contactId: "4", segment: "Work", firstName: "Bob" }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
        result.current.setFirstNameSearch("John");
      });

      // Wait for debounce to complete and filtering to update
      await waitFor(
        () => {
          expect(result.current.filteredContacts.length).toBe(1);
        },
        { timeout: 500 }
      );

      // Should first filter to Personal, then filter by firstName "John"
      expect(result.current.filteredContacts).toHaveLength(1);
      expect(result.current.filteredContacts[0].id).toBe("1");
    });

    it("should work with segment filter (focus takes precedence)", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal" }),
        createContact({ contactId: "2", segment: "Work" }),
        createContact({ contactId: "3", segment: "Enterprise" }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("work");
        result.current.setSelectedSegment("Enterprise");
      });

      // Focus filter first (Work = not Personal), then segment filter
      expect(result.current.filteredContacts).toHaveLength(1);
      expect(result.current.filteredContacts[0].id).toBe("3");
    });
  });

  describe("clearFilters", () => {
    it("should reset focus to 'all' when clearing filters", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal" }),
        createContact({ contactId: "2", segment: "Work" }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
        result.current.setSelectedSegment("Work");
      });

      expect(result.current.filteredContacts).toHaveLength(0); // Personal + Work segment = no matches

      act(() => {
        result.current.onClearFilters();
      });

      // After clearing, should show all contacts
      expect(result.current.filteredContacts).toHaveLength(2);
      expect(result.current.focus).toBe("all");
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe("Focus filter order", () => {
    it("should apply focus filter before archived filter", () => {
      const contacts: ContactWithId[] = [
        createContact({ contactId: "1", segment: "Personal", archived: false }),
        createContact({ contactId: "2", segment: "Personal", archived: true }),
        createContact({ contactId: "3", segment: "Work", archived: false }),
        createContact({ contactId: "4", segment: "Work", archived: true }),
      ];

      const { result } = renderHook(() => useFilterContacts(contacts));

      act(() => {
        result.current.setFocus("personal");
        result.current.setShowArchived(false);
      });

      // Should first filter to Personal, then filter out archived
      expect(result.current.filteredContacts).toHaveLength(1);
      expect(result.current.filteredContacts[0].id).toBe("1");
    });
  });
});

