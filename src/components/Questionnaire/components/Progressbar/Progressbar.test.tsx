import { render, screen } from "@testing-library/react";
import { Progressbar } from "./Progressbar";

describe("Progressbar", () => {
  it("renders with default progress of 100%", () => {
    render(<Progressbar />);

    expect(screen.getByText("Your progress - 100%")).toBeInTheDocument();

    const progressFill = document.querySelector(".progressbar-visual-fill");
    expect(progressFill).toHaveStyle("width: 100%");
  });

  it("renders with custom progress percentage", () => {
    render(<Progressbar progressPercentage={75} />);

    expect(screen.getByText("Your progress - 75%")).toBeInTheDocument();

    const progressFill = document.querySelector(".progressbar-visual-fill");
    expect(progressFill).toHaveStyle("width: 75%");
  });

  it("accepts string percentage", () => {
    render(<Progressbar progressPercentage="50" />);

    expect(screen.getByText("Your progress - 50%")).toBeInTheDocument();

    const progressFill = document.querySelector(".progressbar-visual-fill");
    expect(progressFill).toHaveStyle("width: 50%");
  });

  it("handles zero progress", () => {
    render(<Progressbar progressPercentage={0} />);

    expect(screen.getByText("Your progress - 0%")).toBeInTheDocument();

    const progressFill = document.querySelector(".progressbar-visual-fill");
    expect(progressFill).toHaveStyle("width: 0%");
  });

  it("has correct CSS structure", () => {
    render(<Progressbar progressPercentage={25} />);

    expect(document.querySelector(".progressbar")).toBeInTheDocument();
    expect(document.querySelector(".progressbar-visual")).toBeInTheDocument();
    expect(
      document.querySelector(".progressbar-visual-fill")
    ).toBeInTheDocument();
  });
});
