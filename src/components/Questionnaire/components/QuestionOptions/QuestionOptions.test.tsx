import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { QuestionOptions } from "./QuestionOptions";

describe("QuestionOptions", () => {
  const mockOnSelectOption = vi.fn();

  beforeEach(() => {
    mockOnSelectOption.mockClear();
  });

  it("renders 8 option buttons", () => {
    render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(8);
  });

  it("renders labels for strongly disagree and strongly agree", () => {
    render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    expect(screen.getByText("Strongly disagree")).toBeInTheDocument();
    expect(screen.getByText("Strongly agree")).toBeInTheDocument();
  });

  it("calls onSelectOption when a button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[2]); // Click the 3rd button (option 3)

    expect(mockOnSelectOption).toHaveBeenCalledWith(3);
  });

  it("highlights the selected option", () => {
    render(
      <QuestionOptions onSelectOption={mockOnSelectOption} selectedOption={5} />
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[4]).toHaveClass("selected"); // 5th button for option 5

    // Other buttons should not be selected
    buttons.forEach((button, index) => {
      if (index !== 4) {
        expect(button).not.toHaveClass("selected");
      }
    });
  });

  it("does not highlight any option when selectedOption is null", () => {
    render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).not.toHaveClass("selected");
    });
  });

  it("has correct CSS structure", () => {
    render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    expect(document.querySelector(".question-options")).toBeInTheDocument();
    expect(document.querySelector(".options-container")).toBeInTheDocument();
    expect(document.querySelector(".options-labels")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("option-button");
    });
  });

  it("can select different options sequentially", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <QuestionOptions
        onSelectOption={mockOnSelectOption}
        selectedOption={null}
      />
    );

    const buttons = screen.getAllByRole("button");

    // Click first option
    await user.click(buttons[0]);
    expect(mockOnSelectOption).toHaveBeenCalledWith(1);

    // Rerender with first option selected
    rerender(
      <QuestionOptions onSelectOption={mockOnSelectOption} selectedOption={1} />
    );
    expect(buttons[0]).toHaveClass("selected");

    // Click different option
    await user.click(buttons[7]);
    expect(mockOnSelectOption).toHaveBeenCalledWith(8);
  });
});
