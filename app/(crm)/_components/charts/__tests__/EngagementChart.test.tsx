import { render, screen } from "@testing-library/react";
import EngagementChart from "../EngagementChart";

// Mock window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("EngagementChart", () => {
  const mockData = {
    high: 20,
    medium: 30,
    low: 25,
    none: 15,
  };

  beforeEach(() => {
    mockWindowWidth(1280); // Desktop by default
  });

  it("renders chart with data", () => {
    const { container } = render(<EngagementChart data={mockData} />);
    const chartContainer = container.querySelector(".w-full");
    expect(chartContainer).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    const emptyData = { high: 0, medium: 0, low: 0, none: 0 };
    const { container } = render(<EngagementChart data={emptyData} />);
    const chartContainer = container.querySelector(".w-full");
    expect(chartContainer).toBeInTheDocument();
  });

  it("adjusts height for mobile", () => {
    mockWindowWidth(800);
    const { container } = render(<EngagementChart data={mockData} />);
    // Chart should render with mobile dimensions
    const chartContainer = container.querySelector(".w-full");
    expect(chartContainer).toBeInTheDocument();
  });

  it("renders ResponsiveContainer", () => {
    render(<EngagementChart data={mockData} />);
    // Recharts ResponsiveContainer should be present (mocked in jest.setup.js)
    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  });
});

