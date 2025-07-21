import { renderHook } from "@testing-library/react";
import { useUserFromUrl } from "./useUserFromUrl";

// Mock window.location
const mockLocation = {
  search: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("useUserFromUrl", () => {
  beforeEach(() => {
    mockLocation.search = "";
  });

  it("returns null when no user parameter in URL", () => {
    mockLocation.search = "";

    const { result } = renderHook(() => useUserFromUrl());

    expect(result.current).toBeNull();
  });

  it("returns user ID when user parameter exists in URL", () => {
    mockLocation.search = "?user=test-user-123";

    const { result } = renderHook(() => useUserFromUrl());

    expect(result.current).toBe("test-user-123");
  });

  it("returns user ID when user parameter exists with other parameters", () => {
    mockLocation.search = "?other=value&user=test-user-456&another=param";

    const { result } = renderHook(() => useUserFromUrl());

    expect(result.current).toBe("test-user-456");
  });

  it("returns null when user parameter is empty", () => {
    mockLocation.search = "?user=";

    const { result } = renderHook(() => useUserFromUrl());

    expect(result.current).toBe("");
  });

  it("handles URL encoded user parameter", () => {
    mockLocation.search = "?user=test%40user.com";

    const { result } = renderHook(() => useUserFromUrl());

    expect(result.current).toBe("test@user.com");
  });
});
