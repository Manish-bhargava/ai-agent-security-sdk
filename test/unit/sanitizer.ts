import { sanitizeHeaders } from "../../src/security/sanitizer";

const headers = {
  "content-type": "application/json",
  "user-agent": "Chrome",
  "authorization": "Bearer secret-token",
  "cookie": "session=abc123"
};

console.log(sanitizeHeaders(headers));