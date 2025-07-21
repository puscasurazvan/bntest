import { render, screen } from "@testing-library/react";
import { Details } from "./Details";

describe("Details", () => {
  it("renders the component without crashing", () => {
    render(<Details />);

    expect(
      screen.getByText(/we've analysed data from thousands/i)
    ).toBeInTheDocument();
  });

  it("displays the first paragraph about data analysis", () => {
    render(<Details />);

    const firstParagraph = screen.getByText(
      /we've analysed data from thousands of our members who work in graduate roles across a range of sectors to understand which personalities, skills and values best fit each career path/i
    );
    expect(firstParagraph).toBeInTheDocument();
  });

  it("displays the second paragraph about taking the test", () => {
    render(<Details />);

    const secondParagraph = screen.getByText(
      /take this test to understand what career path you might be suited to and how to get started/i
    );
    expect(secondParagraph).toBeInTheDocument();
  });

  it("renders both paragraphs", () => {
    render(<Details />);

    const paragraphs = screen.getAllByText(/.*/);
    const textParagraphs = paragraphs.filter((p) => p.tagName === "P");
    expect(textParagraphs).toHaveLength(2);
  });

  it("has the correct CSS class structure", () => {
    render(<Details />);

    const wrapper = document.querySelector(".text-wrapper");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toContainElement(screen.getByText(/we've analysed data/i));
    expect(wrapper).toContainElement(screen.getByText(/take this test/i));
  });

  it("contains expected keywords about career analysis", () => {
    render(<Details />);

    // Check for key concepts mentioned in the component
    expect(screen.getByText(/personalities/i)).toBeInTheDocument();
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
    expect(screen.getByText(/values/i)).toBeInTheDocument();

    // Since "career path" appears twice, use getAllByText
    const careerPathElements = screen.getAllByText(/career path/i);
    expect(careerPathElements).toHaveLength(2);

    expect(screen.getByText(/graduate roles/i)).toBeInTheDocument();
  });

  it("mentions data analysis methodology", () => {
    render(<Details />);

    expect(screen.getByText(/thousands of our members/i)).toBeInTheDocument();
    expect(screen.getByText(/range of sectors/i)).toBeInTheDocument();
  });

  it("provides call-to-action information", () => {
    render(<Details />);

    expect(screen.getByText(/take this test/i)).toBeInTheDocument();
    expect(screen.getByText(/how to get started/i)).toBeInTheDocument();
  });

  it("renders as a simple text component without interactive elements", () => {
    render(<Details />);

    // Should not have any buttons, links, or form elements
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("has accessible text content", () => {
    render(<Details />);

    // Text should be accessible and readable
    const wrapper = document.querySelector(".text-wrapper");
    expect(wrapper).toHaveTextContent(/we've analysed data/i);
    expect(wrapper).toHaveTextContent(/take this test/i);
  });
});
