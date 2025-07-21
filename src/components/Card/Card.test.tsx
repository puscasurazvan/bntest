import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  const defaultProps = {
    title: "Test Title",
    subtitle: "Test subtitle description",
    icon: "/test-icon.svg",
  };

  it("renders with required props", () => {
    render(<Card {...defaultProps} />);

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test subtitle description")).toBeInTheDocument();
    expect(screen.getByAltText("Test Title")).toBeInTheDocument();
  });

  it("uses default props when not provided", () => {
    render(<Card icon="/test-icon.svg" />);

    expect(screen.getByText("2 minutes")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gain insights into your future career in just two minutes."
      )
    ).toBeInTheDocument();
  });

  it("applies custom icon border color", () => {
    render(<Card {...defaultProps} iconBorderColor="#ff0000" />);

    const iconWrapper = document.querySelector(".icon-wrapper");
    expect(iconWrapper).toHaveStyle("border-color: #ff0000");
  });

  it("applies default icon border color when not specified", () => {
    render(<Card {...defaultProps} />);

    const iconWrapper = document.querySelector(".icon-wrapper");
    expect(iconWrapper).toHaveStyle("border-color: #ffca30");
  });

  it("has correct CSS classes", () => {
    render(<Card {...defaultProps} />);

    expect(document.querySelector(".card")).toBeInTheDocument();
    expect(document.querySelector(".icon-wrapper")).toBeInTheDocument();
    expect(document.querySelector(".card-icon")).toBeInTheDocument();
    expect(document.querySelector(".card-title")).toBeInTheDocument();
    expect(document.querySelector(".card-subtitle")).toBeInTheDocument();
  });

  it("renders icon with correct alt text", () => {
    render(<Card {...defaultProps} />);

    const icon = screen.getByAltText("Test Title");
    expect(icon).toHaveAttribute("src", "/test-icon.svg");
    expect(icon).toHaveClass("card-icon");
  });
});
