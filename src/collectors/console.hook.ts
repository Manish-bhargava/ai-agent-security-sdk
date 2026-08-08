import { collectConsoleEvent } from "./console.collector";
import { RuntimeEvent } from "../core/types";

type LogHandler = (event: RuntimeEvent) => void;

const originalConsole = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

let installed = false;

export function installConsoleHook(
  onEvent: LogHandler
): () => void {
  if (installed) {
    return () => {};
  }

  installed = true;

  console.log = (...args: unknown[]) => {
    onEvent(collectConsoleEvent("log", args));
    originalConsole.log(...args);
  };

  console.info = (...args: unknown[]) => {
    onEvent(collectConsoleEvent("info", args));
    originalConsole.info(...args);
  };

  console.warn = (...args: unknown[]) => {
    onEvent(collectConsoleEvent("warn", args));
    originalConsole.warn(...args);
  };

  console.error = (...args: unknown[]) => {
    onEvent(collectConsoleEvent("error", args));
    originalConsole.error(...args);
  };

  return () => {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;

    installed = false;
  };
}