// Accept a raw meeting id OR a full invite link and return the id portion.
// Examples handled:
//   "abc-def-ghi"
//   "http://localhost:3000/meeting/abc-def-ghi"
//   "https://app.example.com/meeting/abc-def-ghi?foo=1"
export function extractMeetingId(raw) {
  const value = (raw || "").trim();
  if (!value) return "";
  const match = value.match(/\/meeting\/([^/?#\s]+)/i);
  if (match) return decodeURIComponent(match[1]);
  // Bare value — strip any stray query/hash.
  return value.split(/[?#\s]/)[0];
}
