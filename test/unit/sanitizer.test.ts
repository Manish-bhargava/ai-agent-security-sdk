import { describe, expect, it } from "vitest";
import { sanitizeHeaders } from "../../src/security/sanitizer";

describe("sanitizeHeaders", () => {
  it("redacts sensitive headers", () => {
    const result = sanitizeHeaders({
      authorization: "Bearer secret-token",
      cookie: "session=secret",
      "content-type": "application/json",
      "user-agent": "Chrome"
    });

    expect(result.authorization).toBe("[REDACTED]");
    expect(result.cookie).toBe("[REDACTED]");

    expect(result["content-type"]).toBe(
      "application/json"
    );

    expect(result["user-agent"]).toBe("Chrome");
  });

  it("handles case-insensitive header names", () => {
    const result = sanitizeHeaders({
      Authorization: "secret"
    });

    expect(result.Authorization).toBe(
      "[REDACTED]"
    );
  });
});