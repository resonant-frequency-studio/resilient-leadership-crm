import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TouchpointStatusActions from "../TouchpointStatusActions";
import { Contact } from "@/types/firestore";

// Mock fetch
global.fetch = jest.fn();

// Mock reportException
jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

describe("TouchpointStatusActions", () => {
  const mockProps = {
    contactId: "contact-1",
    contactName: "John Doe",
    currentStatus: null as Contact["touchpointStatus"],
    onStatusUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  describe("Compact Mode", () => {
    it("renders compact buttons for pending status", () => {
      render(<TouchpointStatusActions {...mockProps} compact />);
      expect(screen.getByText(/mark as contacted/i)).toBeInTheDocument();
      expect(screen.getByText(/skip touchpoint/i)).toBeInTheDocument();
    });

    it("hides complete button when already completed", () => {
      render(
        <TouchpointStatusActions
          {...mockProps}
          currentStatus="completed"
          compact
        />
      );
      expect(screen.queryByText(/mark as contacted/i)).not.toBeInTheDocument();
      expect(screen.getByText(/skip touchpoint/i)).toBeInTheDocument();
    });

    it("hides skip button when already cancelled", () => {
      render(
        <TouchpointStatusActions
          {...mockProps}
          currentStatus="cancelled"
          compact
        />
      );
      expect(screen.queryByText(/skip touchpoint/i)).not.toBeInTheDocument();
    });
  });

  describe("Full Mode", () => {
    it("shows status badge for completed", () => {
      render(
        <TouchpointStatusActions
          {...mockProps}
          currentStatus="completed"
        />
      );
      expect(screen.getByText(/contacted/i)).toBeInTheDocument();
    });

    it("shows status badge for cancelled", () => {
      render(
        <TouchpointStatusActions
          {...mockProps}
          currentStatus="cancelled"
        />
      );
      expect(screen.getByText(/skipped/i)).toBeInTheDocument();
    });

    it("shows status badge for pending", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it("shows action buttons for pending status", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      expect(screen.getByText(/mark as contacted/i)).toBeInTheDocument();
      expect(screen.getByText(/skip touchpoint/i)).toBeInTheDocument();
    });

    it("shows restore button for completed/cancelled", () => {
      render(
        <TouchpointStatusActions
          {...mockProps}
          currentStatus="completed"
        />
      );
      expect(screen.getByText(/restore to pending/i)).toBeInTheDocument();
    });
  });

  describe("Modal Interactions", () => {
    it("opens complete modal on button click", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      const button = screen.getByText(/mark as contacted/i);
      fireEvent.click(button);
      expect(screen.getByText(/mark the touchpoint for/i)).toBeInTheDocument();
    });

    it("opens cancel modal on button click", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      const button = screen.getByText(/skip touchpoint/i);
      fireEvent.click(button);
      expect(screen.getByText(/skip the touchpoint for/i)).toBeInTheDocument();
    });

    it("closes modal on cancel", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      fireEvent.click(screen.getByText(/mark as contacted/i));
      fireEvent.click(screen.getByText(/cancel/i));
      expect(screen.queryByText(/mark the touchpoint for/i)).not.toBeInTheDocument();
    });

    it("allows entering reason in textarea", () => {
      render(<TouchpointStatusActions {...mockProps} />);
      fireEvent.click(screen.getByText(/mark as contacted/i));
      const textarea = screen.getByPlaceholderText(/optional note/i);
      fireEvent.change(textarea, { target: { value: "Discussed proposal" } });
      expect(textarea).toHaveValue("Discussed proposal");
    });
  });

  describe("Status Updates", () => {
    it("calls API to complete touchpoint", async () => {
      render(<TouchpointStatusActions {...mockProps} />);
      fireEvent.click(screen.getByText(/mark as contacted/i));
      fireEvent.click(screen.getByText(/mark completed/i));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/contacts/contact-1/touchpoint-status"),
          expect.objectContaining({
            method: "PATCH",
            body: expect.stringContaining('"status":"completed"'),
          })
        );
      });
    });

    it("calls API to cancel touchpoint", async () => {
      render(<TouchpointStatusActions {...mockProps} />);
      const skipButtons = screen.getAllByText(/skip touchpoint/i);
      fireEvent.click(skipButtons[0]); // Click the main button
      // Wait for modal to open, then click the confirm button in modal
      await waitFor(() => {
        const modalButtons = screen.getAllByText(/skip touchpoint/i);
        expect(modalButtons.length).toBeGreaterThan(1);
      });
      const modalButtons = screen.getAllByText(/skip touchpoint/i);
      fireEvent.click(modalButtons[modalButtons.length - 1]); // Click the confirm button in modal

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/contacts/contact-1/touchpoint-status"),
          expect.objectContaining({
            method: "PATCH",
            body: expect.stringContaining('"status":"cancelled"'),
          })
        );
      });
    });

    it("calls onStatusUpdate callback after successful update", async () => {
      render(<TouchpointStatusActions {...mockProps} />);
      fireEvent.click(screen.getByText(/mark as contacted/i));
      fireEvent.click(screen.getByText(/mark completed/i));

      await waitFor(() => {
        expect(mockProps.onStatusUpdate).toHaveBeenCalled();
      });
    });

    it("handles API errors gracefully", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Failed to update" }),
      });
      global.alert = jest.fn();

      render(<TouchpointStatusActions {...mockProps} />);
      fireEvent.click(screen.getByText(/mark as contacted/i));
      fireEvent.click(screen.getByText(/mark completed/i));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalled();
      });
    });
  });
});

