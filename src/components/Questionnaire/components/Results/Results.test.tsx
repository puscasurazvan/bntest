import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Results } from "./Results";

describe("Results", () => {
  const mockOnButtonClick = vi.fn();

  beforeEach(() => {
    mockOnButtonClick.mockClear();
  });

  it("renders completion date and congratulations message", () => {
    render(
      <Results
        dateCompleted="January 15, 2024"
        onButtonClick={mockOnButtonClick}
      />
    );

    expect(
      screen.getByText("Completed on January 15, 2024")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Well done on completing your test. You can view the results now."
      )
    ).toBeInTheDocument();
  });

  it("renders graduation image", () => {
    render(
      <Results
        dateCompleted="January 15, 2024"
        onButtonClick={mockOnButtonClick}
      />
    );

    const image = screen.getByAltText("Graduation celebration");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/assets/graduation.svg");
  });

  it("renders results button and calls onButtonClick when clicked", async () => {
    const user = userEvent.setup();
    render(
      <Results
        dateCompleted="January 15, 2024"
        onButtonClick={mockOnButtonClick}
      />
    );

    const button = screen.getByRole("button", { name: /see your results/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
  });

  it("handles empty date string", () => {
    render(<Results dateCompleted="" onButtonClick={mockOnButtonClick} />);

    expect(screen.getByText("Completed on")).toBeInTheDocument();
  });

  it("has correct CSS structure", () => {
    render(
      <Results
        dateCompleted="January 15, 2024"
        onButtonClick={mockOnButtonClick}
      />
    );

    expect(document.querySelector(".results-container")).toBeInTheDocument();
    expect(document.querySelector(".results-header")).toBeInTheDocument();
    expect(document.querySelector(".results-content")).toBeInTheDocument();
    expect(document.querySelector(".completion-date")).toBeInTheDocument();
    expect(document.querySelector(".congratulations-text")).toBeInTheDocument();
    expect(document.querySelector(".results-button")).toBeInTheDocument();
  });

  it("displays graduation image with correct class", () => {
    render(
      <Results
        dateCompleted="January 15, 2024"
        onButtonClick={mockOnButtonClick}
      />
    );

    const image = screen.getByAltText("Graduation celebration");
    expect(image).toHaveClass("graduation-image");
  });
});
