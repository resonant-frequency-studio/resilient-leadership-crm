import { render, screen, fireEvent } from "@testing-library/react";
import ActionItemsFilters from "../ActionItemsFilters";
import { ActionItemsFiltersProvider } from "../ActionItemsFiltersContext";
import { createMockContact } from "@/components/__tests__/test-utils";
import type { Contact } from "@/types/firestore";

const mockContacts: Array<[string, Contact]> = [
  ["contact-1", createMockContact({ contactId: "contact-1", firstName: "John", lastName: "Doe" })],
  ["contact-2", createMockContact({ contactId: "contact-2", firstName: "Jane", lastName: "Smith", primaryEmail: "jane@example.com" })],
  ["contact-3", createMockContact({ contactId: "contact-3", firstName: "", lastName: "", primaryEmail: "bob@example.com" })],
];

function renderWithProvider(contacts: Array<[string, Contact]>, uniqueContactIds: string[]) {
  return render(
    <ActionItemsFiltersProvider>
      <ActionItemsFilters contacts={contacts} uniqueContactIds={uniqueContactIds} />
    </ActionItemsFiltersProvider>
  );
}

describe("ActionItemsFilters", () => {
  it("renders all filter dropdowns", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    expect(screen.getByLabelText("Filter by Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Contact")).toBeInTheDocument();
  });

  it("renders status filter options", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const statusSelect = screen.getByLabelText("Filter by Status");
    expect(statusSelect).toBeInTheDocument();

    const options = Array.from(statusSelect.querySelectorAll("option")).map(
      (opt) => opt.textContent
    );
    expect(options).toContain("All Statuses");
    expect(options).toContain("Pending");
    expect(options).toContain("Completed");
  });

  it("renders date filter options", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const dateSelect = screen.getByLabelText("Filter by Date");
    expect(dateSelect).toBeInTheDocument();

    const options = Array.from(dateSelect.querySelectorAll("option")).map(
      (opt) => opt.textContent
    );
    expect(options).toContain("All Dates");
    expect(options).toContain("Overdue");
    expect(options).toContain("Due Today");
    expect(options).toContain("Due This Week");
    expect(options).toContain("Upcoming");
  });

  it("renders contact filter with contact names", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const contactSelect = screen.getByLabelText("Filter by Contact");
    expect(contactSelect).toBeInTheDocument();

    const options = Array.from(contactSelect.querySelectorAll("option")).map(
      (opt) => opt.textContent
    );
    expect(options).toContain("All Contacts");
    expect(options).toContain("John Doe");
    expect(options).toContain("Jane Smith");
    expect(options).toContain("bob@example.com");
  });

  it("updates filterStatus when status select changes", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const statusSelect = screen.getByLabelText("Filter by Status");
    fireEvent.change(statusSelect, { target: { value: "pending" } });

    expect(statusSelect).toHaveValue("pending");
  });

  it("updates filterDate when date select changes", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const dateSelect = screen.getByLabelText("Filter by Date");
    fireEvent.change(dateSelect, { target: { value: "overdue" } });

    expect(dateSelect).toHaveValue("overdue");
  });

  it("updates selectedContactId when contact select changes", () => {
    renderWithProvider(mockContacts, ["contact-1", "contact-2", "contact-3"]);

    const contactSelect = screen.getByLabelText("Filter by Contact");
    fireEvent.change(contactSelect, { target: { value: "contact-1" } });

    expect(contactSelect).toHaveValue("contact-1");
  });

  it("handles empty contact name by using email", () => {
    const contactsWithEmptyName: Array<[string, Contact]> = [
      ["contact-1", createMockContact({ contactId: "contact-1", firstName: "", lastName: "", primaryEmail: "test@example.com" })],
    ];

    renderWithProvider(contactsWithEmptyName, ["contact-1"]);

    const contactSelect = screen.getByLabelText("Filter by Contact");
    const options = Array.from(contactSelect.querySelectorAll("option")).map(
      (opt) => opt.textContent
    );
    expect(options).toContain("test@example.com");
  });

  it("does not show contacts with empty names and emails", () => {
    const contactsWithEmpty: Array<[string, Contact]> = [
      ["contact-1", createMockContact({ contactId: "contact-1", firstName: "", lastName: "", primaryEmail: "" })],
      ["contact-2", createMockContact({ contactId: "contact-2", firstName: "John", lastName: "Doe" })],
    ];

    renderWithProvider(contactsWithEmpty, ["contact-1", "contact-2"]);

    const contactSelect = screen.getByLabelText("Filter by Contact");
    const options = Array.from(contactSelect.querySelectorAll("option")).map(
      (opt) => opt.textContent
    );
    expect(options).not.toContain("");
    expect(options).toContain("John Doe");
  });
});

