import { LogEvent } from "../core/types";

type LogLevel = LogEvent["level"];

export function collectConsoleEvent(
  level: LogLevel,
  args: unknown[],
  requestId?: string
): LogEvent {
  const message = args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }

      try {
        return JSON.stringify(arg);
      } catch {
        return "[Unserializable]";
      }
    })
    .join(" ");

  return {
    type: "log",
    level,
    message,
    timestamp: new Date().toISOString(),
    requestId,
  };
}