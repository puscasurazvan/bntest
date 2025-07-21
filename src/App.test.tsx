import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import * as hooks from "./hooks";

// Mock the hooks used in Questionnaire - these need to be declared before vi.mock
vi.mock("./hooks", () => ({
  useFetchQuestions: vi.fn(),
  useSubmitAnswers: vi.fn(),
  useUserFromUrl: vi.fn(),
  useGetLatestSubmissions: vi.fn(),
}));

// Get the mocked hooks
const mockedHooks = vi.mocked(hooks);

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock uuid
vi.mock("uuid", () => ({
  v4: () => "test-uuid-123",
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("App", () => {
  beforeEach(() => {
    // Mock hooks with default values
    mockedHooks.useUserFromUrl.mockReturnValue("test-user");
    mockedHooks.useFetchQuestions.mockReturnValue({
      data: { questions: [], user: "test-user" },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isPending: false,
      refetch: vi.fn(),
      fetchStatus: "idle" as const,
      status: "success" as const,
    } as unknown as ReturnType<typeof hooks.useFetchQuestions>);
    mockedHooks.useSubmitAnswers.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isSuccess: false,
      data: undefined,
      error: null,
      variables: undefined,
      isError: false,
      isIdle: true,
      status: "idle" as const,
      reset: vi.fn(),
      mutateAsync: vi.fn(),
      failureCount: 0,
      failureReason: null,
      submittedAt: 0,
    } as unknown as ReturnType<typeof hooks.useSubmitAnswers>);
    mockedHooks.useGetLatestSubmissions.mockReturnValue({
      data: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof hooks.useGetLatestSubmissions>);
  });

  it("renders without crashing", () => {
    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByText(/career path test/i)).toBeInTheDocument();
  });

  it("renders the Header component", () => {
    render(<App />, { wrapper: createWrapper() });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(/career path test/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /discover careers that match your skills and personality/i
      )
    ).toBeInTheDocument();
  });

  it("renders all three Card components with correct content", () => {
    render(<App />, { wrapper: createWrapper() });

    // First card - 24 questions
    expect(screen.getByText("24 questions")).toBeInTheDocument();
    expect(
      screen.getByText(/answer 24 questins about your working style/i)
    ).toBeInTheDocument();

    // Second card - 2 minutes
    expect(screen.getByText("2 minutes")).toBeInTheDocument();
    expect(
      screen.getByText(
        /gain insights into your future career in just two minutes/i
      )
    ).toBeInTheDocument();

    // Third card - Personalised advice
    expect(screen.getByText("Personalised advice")).toBeInTheDocument();
    expect(
      screen.getByText(/receive personalised advice to guide you/i)
    ).toBeInTheDocument();
  });

  it("renders card icons with correct sources", () => {
    render(<App />, { wrapper: createWrapper() });

    const clipboardIcon = screen.getByAltText("24 questions");
    const stopwatchIcon = screen.getByAltText("2 minutes");
    const scissorIcon = screen.getByAltText("Personalised advice");

    expect(clipboardIcon).toHaveAttribute(
      "src",
      "/assets/icons/clipboard-question.svg"
    );
    expect(stopwatchIcon).toHaveAttribute("src", "/assets/icons/stopwatch.svg");
    expect(scissorIcon).toHaveAttribute(
      "src",
      "/assets/icons/scissor-cutting.svg"
    );
  });

  it("applies correct icon border colors", () => {
    render(<App />, { wrapper: createWrapper() });

    // Check that icon wrappers have the correct border colors
    const iconWrappers = document.querySelectorAll(".icon-wrapper");
    expect(iconWrappers[0]).toHaveStyle("border-color: #3b82f6"); // blue
    expect(iconWrappers[1]).toHaveStyle("border-color: #10b981"); // green
    expect(iconWrappers[2]).toHaveStyle("border-color: #f59e0b"); // yellow
  });

  it("renders the Details component", () => {
    render(<App />, { wrapper: createWrapper() });

    expect(
      screen.getByText(/we've analysed data from thousands/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/take this test to understand what career path/i)
    ).toBeInTheDocument();
  });

  it("renders the Questionnaire component", () => {
    render(<App />, { wrapper: createWrapper() });

    // The questionnaire should be present (might show loading, progress, etc.)
    // Since we mocked it to show empty questions, it should show some basic structure
    expect(document.querySelector(".questionnaire")).toBeInTheDocument();
  });

  it("has correct layout structure", () => {
    render(<App />, { wrapper: createWrapper() });

    const container = document.querySelector(".container");
    const cardsContainer = document.querySelector(".cards-container");

    expect(container).toBeInTheDocument();
    expect(cardsContainer).toBeInTheDocument();
    expect(cardsContainer?.children).toHaveLength(3); // Three cards
  });

  it("renders components in correct order", () => {
    render(<App />, { wrapper: createWrapper() });

    const container = document.querySelector(".container");
    const children = Array.from(container?.children || []);

    // Should have Header, cards container, Details, Questionnaire, and possibly other elements
    expect(children.length).toBeGreaterThanOrEqual(4);

    // Check that Header comes first
    expect(children[0]).toHaveClass("header");
  });

  it('displays the typo in "questins" as specified in the code', () => {
    render(<App />, { wrapper: createWrapper() });

    // The typo "questins" should be present as written in the code
    expect(screen.getByText(/answer 24 questins about/i)).toBeInTheDocument();
  });
});
