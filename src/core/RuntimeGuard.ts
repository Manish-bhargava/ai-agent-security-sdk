
import { RuntimeGuardConfig } from "./config";
import { httpMiddleware } from "../middleware/http.middleware";

export class RuntimeGuard {

  constructor(private config: RuntimeGuardConfig) {}

  middleware() {
    return httpMiddleware;
  }
}