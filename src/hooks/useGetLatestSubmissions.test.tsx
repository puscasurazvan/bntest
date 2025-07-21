import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetLatestSubmissions } from "./useGetLatestSubmissions";

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

describe("useGetLatestSubmissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_URL", "https://fhc-api.onrender.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not fetch when user is null", () => {
    const { result } = renderHook(() => useGetLatestSubmissions(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("fetches latest submissions successfully", async () => {
    const mockResponse = {
      ok: true,
      latestSubmission: "2024-01-15T10:30:00Z",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useGetLatestSubmissions("test-user"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://fhc-api.onrender.com/submissions?user=test-user"
    );
  });

  it("handles 404 error when user has no submissions", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useGetLatestSubmissions("test-user"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe(
      "User hasn't submitted any answers"
    );
  });

  it("handles other fetch errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useGetLatestSubmissions("test-user"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it("encodes user parameter correctly", async () => {
    const mockResponse = { ok: true };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderHook(() => useGetLatestSubmissions("test@user.com"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "https://fhc-api.onrender.com/submissions?user=test%40user.com"
      );
    });
  });

  it("handles response without latestSubmission", async () => {
    const mockResponse = {
      ok: true,
      // No latestSubmission property
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useGetLatestSubmissions("test-user"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.data?.latestSubmission).toBeUndefined();
  });
});
