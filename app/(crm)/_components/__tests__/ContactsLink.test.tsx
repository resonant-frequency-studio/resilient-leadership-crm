import { render, screen } from "@testing-library/react";
import ContactsLink from "../ContactsLink";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("ContactsLink", () => {
  it("renders with default variant and text", () => {
    render(<ContactsLink />);
    const link = screen.getByRole("link", { name: /back to contacts/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/contacts");
  });

  it("renders with custom children", () => {
    render(<ContactsLink>Go to Contacts</ContactsLink>);
    expect(screen.getByText("Go to Contacts")).toBeInTheDocument();
  });

  it("applies default variant styles", () => {
    const { container } = render(<ContactsLink />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("flex", "items-center", "gap-2");
  });

  it("applies error variant styles", () => {
    const { container } = render(<ContactsLink variant="error" />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("bg-red-600", "hover:bg-red-700", "text-white");
  });

  it("hides icon in error variant", () => {
    const { container } = render(<ContactsLink variant="error" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });

  it("shows icon in default variant", () => {
    const { container } = render(<ContactsLink variant="default" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<ContactsLink className="custom-class" />);
    const link = container.querySelector("a");
    expect(link).toHaveClass("custom-class");
  });
});

