import {
  Request,
  Response,
  NextFunction,
} from "express";

import { collectHttpEvent } from "../collectors/http.collector";
import { RuntimeGuard } from "../core/RuntimeGuard";

export function httpMiddleware(
  guard: RuntimeGuard
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const startTime = Date.now();

    res.on("finish", () => {
      const event = collectHttpEvent(
        req,
        res,
        startTime
      );

      guard.capture(event);
    });

    next();
  };
}