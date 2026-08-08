export interface HttpEvent {
  type: "http";
  method: string;
  path: string;
  statusCode: number;
  latency: number;
  timestamp: string;
  headers: Record<string, unknown>;
}

export type RuntimeEvent = HttpEvent;

export interface RuntimeGuardConfig {
  endpoint?: string;
  apiKey?: string;

  /** Number of events before automatic flush. */
  batchSize?: number;

  /** Maximum time between flushes in milliseconds. */
  flushInterval?: number;

  /** Maximum number of events kept in memory. */
  maxBufferSize?: number;

  /** HTTP request timeout in milliseconds. */
  requestTimeout?: number;

  /** Number of retries after a failed transport request. */
  maxRetries?: number;

  /** Delay between retries in milliseconds. */
  retryDelay?: number;

  /** Disable SDK console errors. */
  silent?: boolean;
}