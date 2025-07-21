import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFetchQuestions } from "./useFetchQuestions";

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useFetchQuestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock environment variable to match actual value
    vi.stubEnv("VITE_API_URL", "https://fhc-api.onrender.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not fetch when user is null", () => {
    const { result } = renderHook(() => useFetchQuestions(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fetches questions successfully when user is provided", async () => {
    const mockResponse = {
      questions: [
        { id: "q1", text: "Question 1" },
        { id: "q2", text: "Question 2" },
      ],
      user: "test-user",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useFetchQuestions("test-user"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://fhc-api.onrender.com/questions?user=test-user"
    );
  });

  it("handles fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useFetchQuestions("test-user"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.data).toBeUndefined();
  });

  it("encodes user parameter correctly", async () => {
    const mockResponse = { questions: [], user: "test@user.com" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useFetchQuestions("test@user.com"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://fhc-api.onrender.com/questions?user=test%40user.com"
      );
    });
  });
});
