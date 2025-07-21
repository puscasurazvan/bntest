import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubmitAnswers } from "./useSubmitAnswers";

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useSubmitAnswers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_URL", "https://fhc-api.onrender.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("submits answers successfully", async () => {
    const mockResponse = { success: true, id: "submission-123" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useSubmitAnswers(), {
      wrapper: createWrapper(),
    });

    const submitData = {
      user: "test-user",
      answers: [
        { questionId: "q1", answer: 5 },
        { questionId: "q2", answer: 3 },
      ],
    };

    result.current.mutate(submitData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://fhc-api.onrender.com/submissions?user=test-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: [
            { questionId: "q1", answer: 5 },
            { questionId: "q2", answer: 3 },
          ],
        }),
      }
    );
  });

  it("handles submission failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

    const { result } = renderHook(() => useSubmitAnswers(), {
      wrapper: createWrapper(),
    });

    const submitData = {
      user: "test-user",
      answers: [{ questionId: "q1", answer: 5 }],
    };

    result.current.mutate(submitData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Failed to submit answers");
  });

  it("sends correct request format", async () => {
    const mockResponse = { success: true };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useSubmitAnswers(), {
      wrapper: createWrapper(),
    });

    const submitData = {
      user: "test@user.com",
      answers: [
        { questionId: "question-1", answer: 8 },
        { questionId: "question-2", answer: 1 },
        { questionId: "question-3", answer: 4 },
      ],
    };

    result.current.mutate(submitData);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://fhc-api.onrender.com/submissions?user=test@user.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: [
              { questionId: "question-1", answer: 8 },
              { questionId: "question-2", answer: 1 },
              { questionId: "question-3", answer: 4 },
            ],
          }),
        }
      );
    });
  });

  it("starts in idle state", () => {
    const { result } = renderHook(() => useSubmitAnswers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it("handles network errors", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSubmitAnswers(), {
      wrapper: createWrapper(),
    });

    const submitData = {
      user: "test-user",
      answers: [{ questionId: "q1", answer: 5 }],
    };

    result.current.mutate(submitData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Network error");
  });
});
