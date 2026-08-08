export interface HttpEvent {
  type: "http";
  method: string;
  path: string;
  statusCode: number;
  latency: number;
  timestamp: string;
  headers: Record<string, string>;
  requestId?: string;
}

export interface LogEvent {
  type: "log";
  level: "log" | "info" | "warn" | "error";
  message: string;
  timestamp: string;
  requestId?: string;
}

export type RuntimeEvent = HttpEvent | LogEvent;