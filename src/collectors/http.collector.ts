
import { Request, Response } from "express";
import { HttpEvent } from "../core/types";

export function collectHttpEvent(
  req: Request,
  res: Response,
  startTime: number
): HttpEvent {

  return {
    type: "http",
    method: req.method,
    path: req.originalUrl,
    statusCode: res.statusCode,
    latency: Date.now() - startTime,
    timestamp: new Date().toISOString()
  };
}