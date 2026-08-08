import {
  Request,
  Response,
  NextFunction
} from "express";

import { EventBuffer } from "../pipeline/event-buffer";
import { collectHttpEvent } from "../collectors/http.collector";
import { sanitizeHeaders } from "../security/sanitizer";

export function createHttpMiddleware(
  buffer: EventBuffer,
  onEventAdded: () => void
) {
  return function runtimeGuardMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const startTime = Date.now();

    res.once("finish", () => {
      try {
        const event = collectHttpEvent(
          req,
          res,
          startTime
        );

        event.headers = sanitizeHeaders(
          event.headers
        );

        buffer.add(event);

        onEventAdded();
      } catch (error) {
        console.error(
          "[RuntimeGuard] Middleware error:",
          error
        );
      }
    });

    next();
  };
}