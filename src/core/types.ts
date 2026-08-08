export interface HttpEvent {
  type: "http";
  method: string;
  path: string;
  statusCode: number;
  latency: number;
  timestamp: string;
  headers: Record<string, unknown>;
}

export interface RuntimeGuardConfig {
  endpoint?: string;
  apiKey?: string;
  batchSize?: number;
  flushInterval?: number;
}

export type RuntimeEvent = HttpEvent;