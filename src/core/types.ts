export interface HttpEvent {
  type: "http";
  method: string;
  path: string;
  statusCode: number;
  latency: number;
  timestamp: string;
}