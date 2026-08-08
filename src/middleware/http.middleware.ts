import { Request, Response, NextFunction } from "express";
import { collectHttpEvent } from "../collectors/http.collector";
import { sanitizeHeaders } from "../security/sanitizer";
import { EventBuffer } from "../pipeline/event-buffer";

export function createHttpMiddleware(
  buffer: EventBuffer,
  onEventAdded: () => void
) {
  return function httpMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const startTime = Date.now();

    res.on("finish", () => {
      const event = collectHttpEvent(
        req,
        res,
        startTime
      );

      event.headers = sanitizeHeaders(
        event.headers
      );

      buffer.add(event);

      console.log(
        "[RuntimeGuard] Buffer size:",
        buffer.size()
      );

      onEventAdded();
    });

    next();
  };
}