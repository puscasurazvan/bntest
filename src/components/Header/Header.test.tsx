import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the header with correct title and description", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /career path test/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /discover careers that match your skills and personality/i
      )
    ).toBeInTheDocument();
  });

  it("has the correct CSS class", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toHaveClass("header");
  });
});
