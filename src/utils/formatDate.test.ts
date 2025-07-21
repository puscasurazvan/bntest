import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats ISO date string with default format", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toBe("15/01/2024");
  });

  it("formats ISO date string with custom format", () => {
    const result = formatDate("2024-01-15T10:30:00Z", "MMM dd, yyyy");
    expect(result).toBe("Jan 15, 2024");
  });

  it("formats date string in different formats", () => {
    const result = formatDate("2024-12-25", "yyyy-MM-dd");
    expect(result).toBe("2024-12-25");
  });

  it("returns undefined for empty string", () => {
    const result = formatDate("");
    expect(result).toBeUndefined();
  });

  it("returns undefined for null/undefined input", () => {
    expect(formatDate(null as unknown as string)).toBeUndefined();
    expect(formatDate(undefined as unknown as string)).toBeUndefined();
  });

  it("handles various date string formats", () => {
    expect(formatDate("2024-01-15")).toBe("15/01/2024");
    expect(formatDate("2024/01/15")).toBe("15/01/2024");
    expect(formatDate("January 15, 2024")).toBe("15/01/2024");
  });

  it("throws error for invalid date string", () => {
    expect(() => formatDate("invalid-date")).toThrow();
  });

  it("formats with different custom formats", () => {
    const date = "2024-01-15T10:30:00Z";

    expect(formatDate(date, "dd-MM-yyyy")).toBe("15-01-2024");
    expect(formatDate(date, "MMMM do, yyyy")).toBe("January 15th, 2024");
    expect(formatDate(date, "yyyy")).toBe("2024");
    expect(formatDate(date, "MMM")).toBe("Jan");
  });

  it("formats Date objects directly", () => {
    const date = new Date("2024-01-15T10:30:00Z");

    expect(formatDate(date)).toBe("15/01/2024");
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2024-01-15");
    expect(formatDate(date, "MMM dd, yyyy")).toBe("Jan 15, 2024");
  });

  it("handles both string and Date object inputs", () => {
    const dateString = "2024-12-25T12:00:00Z";
    const dateObject = new Date("2024-12-25T12:00:00Z");

    // Both should produce the same result
    expect(formatDate(dateString)).toBe(formatDate(dateObject));
    expect(formatDate(dateString, "dd/MM/yyyy")).toBe(
      formatDate(dateObject, "dd/MM/yyyy")
    );
  });
});
