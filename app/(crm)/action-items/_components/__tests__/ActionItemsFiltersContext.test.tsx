import { render, screen, fireEvent } from "@testing-library/react";
import {
  ActionItemsFiltersProvider,
  useActionItemsFilters,
} from "../ActionItemsFiltersContext";

// Test component that uses the hook
function TestComponent() {
  const {
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    selectedContactId,
    setSelectedContactId,
  } = useActionItemsFilters();

  return (
    <div>
      <div data-testid="filter-status">{filterStatus}</div>
      <div data-testid="filter-date">{filterDate}</div>
      <div data-testid="selected-contact-id">{selectedContactId || "none"}</div>
      <button
        onClick={() => setFilterStatus("pending")}
        data-testid="set-status-pending"
      >
        Set Pending
      </button>
      <button
        onClick={() => setFilterDate("overdue")}
        data-testid="set-date-overdue"
      >
        Set Overdue
      </button>
      <button
        onClick={() => setSelectedContactId("contact-123")}
        data-testid="set-contact"
      >
        Set Contact
      </button>
    </div>
  );
}

describe("ActionItemsFiltersContext", () => {
  it("provides default filter values", () => {
    render(
      <ActionItemsFiltersProvider>
        <TestComponent />
      </ActionItemsFiltersProvider>
    );

    expect(screen.getByTestId("filter-status")).toHaveTextContent("all");
    expect(screen.getByTestId("filter-date")).toHaveTextContent("all");
    expect(screen.getByTestId("selected-contact-id")).toHaveTextContent("none");
  });

  it("updates filterStatus when setFilterStatus is called", () => {
    render(
      <ActionItemsFiltersProvider>
        <TestComponent />
      </ActionItemsFiltersProvider>
    );

    const setPendingButton = screen.getByTestId("set-status-pending");
    fireEvent.click(setPendingButton);

    expect(screen.getByTestId("filter-status")).toHaveTextContent("pending");
  });

  it("updates filterDate when setFilterDate is called", () => {
    render(
      <ActionItemsFiltersProvider>
        <TestComponent />
      </ActionItemsFiltersProvider>
    );

    const setOverdueButton = screen.getByTestId("set-date-overdue");
    fireEvent.click(setOverdueButton);

    expect(screen.getByTestId("filter-date")).toHaveTextContent("overdue");
  });

  it("updates selectedContactId when setSelectedContactId is called", () => {
    render(
      <ActionItemsFiltersProvider>
        <TestComponent />
      </ActionItemsFiltersProvider>
    );

    const setContactButton = screen.getByTestId("set-contact");
    fireEvent.click(setContactButton);

    expect(screen.getByTestId("selected-contact-id")).toHaveTextContent(
      "contact-123"
    );
  });

  it("throws error when hook is used outside provider", () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useActionItemsFilters must be used within ActionItemsFiltersProvider");

    consoleError.mockRestore();
  });
});

