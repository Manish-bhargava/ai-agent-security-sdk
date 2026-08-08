// watch request
import { Request, Response, NextFunction } from "express";
import { collectHttpEvent } from "../collectors/http.collector";

export function httpMiddleware(
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

    console.log("[RuntimeGuard]", event);
  });

  next();
}