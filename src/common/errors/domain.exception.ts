export abstract class DomainException extends Error {
  protected constructor(
    readonly code: string,
    readonly status: number,
    message: string,
    readonly details: unknown = null,
  ) {
    super(message);
    this.name = "DomainException";
  }
}
