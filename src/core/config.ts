export interface RuntimeGuardConfig {
  endpoint: string;
  apiKey?: string;

  bufferSize?: number;
  batchSize?: number;
  flushInterval?: number;
}