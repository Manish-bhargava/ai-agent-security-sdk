export class RuntimeGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeGuardError";
  }
}

export class RuntimeGuardTransportError extends RuntimeGuardError {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "RuntimeGuardTransportError";
  }
}