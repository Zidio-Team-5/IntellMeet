import { describe, it, expect } from "vitest";
import { extractMeetingId } from "../shared/utils/meeting.js";

describe("extractMeetingId", () => {
  it("returns a bare meeting id unchanged", () => {
    expect(extractMeetingId("abc-def-ghi")).toBe("abc-def-ghi");
  });
  it("extracts id from a full localhost invite link", () => {
    expect(extractMeetingId("http://localhost:3000/meeting/abc-def-ghi")).toBe("abc-def-ghi");
  });
  it("extracts id from a production link with query string", () => {
    expect(extractMeetingId("https://app.example.com/meeting/xyz-uvw-rst?ref=email")).toBe("xyz-uvw-rst");
  });
  it("strips stray query/hash from a bare value", () => {
    expect(extractMeetingId("abc-def-ghi?foo=1")).toBe("abc-def-ghi");
  });
  it("trims whitespace and returns empty for blank input", () => {
    expect(extractMeetingId("   ")).toBe("");
    expect(extractMeetingId("  abc-def-ghi  ")).toBe("abc-def-ghi");
  });
});
