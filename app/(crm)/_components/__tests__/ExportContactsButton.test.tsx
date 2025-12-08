import { render, screen, fireEvent } from "@testing-library/react";
import ExportContactsButton from "../ExportContactsButton";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock papaparse
jest.mock("papaparse", () => ({
  __esModule: true,
  default: {
    unparse: jest.fn((data: unknown[]) => {
      if (!Array.isArray(data) || data.length === 0) return "";
      const firstItem = data[0] as Record<string, string>;
      if (!firstItem || typeof firstItem !== "object") return "";
      const headers = Object.keys(firstItem).join(",");
      const rows = (data as Array<Record<string, string>>).map((row) => Object.values(row).join(","));
      return `${headers}\n${rows.join("\n")}`;
    }),
  },
}));

import Papa from "papaparse";

const mockUnparse = Papa.unparse as jest.MockedFunction<typeof Papa.unparse>;

beforeEach(() => {
  global.alert = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ExportContactsButton", () => {
  const mockContacts = [
    createMockContact({
      id: "1",
      primaryEmail: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      tags: ["VIP", "Priority"],
      segment: "Enterprise",
      engagementScore: 75,
    }),
    createMockContact({
      id: "2",
      primaryEmail: "jane@example.com",
      firstName: "Jane",
      lastName: "Smith",
      tags: [],
      segment: "SMB",
    }),
  ];

  it("renders button with contact count", () => {
    render(<ExportContactsButton contacts={mockContacts} />);
    const button = screen.getByRole("button", { name: /export \(2\)/i });
    expect(button).toBeInTheDocument();
  });

  it("renders button without count when no contacts", () => {
    render(<ExportContactsButton contacts={[]} />);
    const button = screen.getByRole("button", { name: /^export$/i });
    expect(button).toBeInTheDocument();
  });

  it("disables button when no contacts", () => {
    render(<ExportContactsButton contacts={[]} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("disables button when disabled prop is true", () => {
    render(<ExportContactsButton contacts={mockContacts} disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });


  it("generates CSV data with correct structure", () => {
    render(<ExportContactsButton contacts={mockContacts} />);
    const button = screen.getByRole("button");
    
    // Mock Blob and URL methods
    global.Blob = jest.fn().mockImplementation((content) => ({ content })) as unknown as typeof Blob;
    global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
    global.URL.revokeObjectURL = jest.fn();
    
    // Create a real anchor element for testing
    const link = document.createElement("a");
    link.click = jest.fn();
    jest.spyOn(document, "createElement").mockReturnValue(link);
    jest.spyOn(document.body, "appendChild").mockImplementation(() => link);
    jest.spyOn(document.body, "removeChild").mockImplementation(() => link);

    fireEvent.click(button);

    // Verify mockUnparse was called with correct data structure
    expect(mockUnparse).toHaveBeenCalled();
    const csvData = mockUnparse.mock.calls[0][0] as Array<Record<string, string>>;
    expect(csvData).toHaveLength(2);
    expect(csvData[0]).toHaveProperty("Email", "john@example.com");
    expect(csvData[0]).toHaveProperty("FirstName", "John");
    
    jest.restoreAllMocks();
  });

  it("formats tags as comma-separated string", () => {
    render(<ExportContactsButton contacts={mockContacts} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockUnparse).toHaveBeenCalled();
    const csvData = mockUnparse.mock.calls[0][0] as Array<Record<string, string>>;
    expect(csvData[0].Tags).toBe("VIP, Priority");
    expect(csvData[1].Tags).toBe("");
  });

  it("formats dates correctly", () => {
    const contactWithDate = createMockContact({
      id: "3",
      nextTouchpointDate: new Date("2024-01-15").toISOString(),
    });
    render(<ExportContactsButton contacts={[contactWithDate]} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    const csvData = mockUnparse.mock.calls[0][0] as Array<Record<string, string>>;
    expect(csvData[0].NextTouchpointDate).toBe("2024-01-15");
  });
});

