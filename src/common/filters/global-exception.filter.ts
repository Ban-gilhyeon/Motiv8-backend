import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { DomainException } from "../errors/domain.exception";

type ErrorResponse = {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details: unknown;
  };
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof DomainException
        ? exception.status
        : exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = this.toErrorResponse(exception, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} ${status}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json(body);
  }

  private toErrorResponse(
    exception: unknown,
    status: number,
  ): ErrorResponse {
    if (exception instanceof DomainException) {
      return {
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details,
        },
      };
    }

    if (!(exception instanceof HttpException)) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "서버에서 오류가 발생했습니다.",
          details: null,
        },
      };
    }

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === "string") {
      return {
        success: false,
        error: {
          code: this.defaultCode(status),
          message: exceptionResponse,
          details: null,
        },
      };
    }

    const responseBody = exceptionResponse as Record<string, unknown>;
    const message = responseBody.message;

    if (Array.isArray(message)) {
      return {
        success: false,
        error: {
          code: "VALIDATION_FAILED",
          message: "요청값이 올바르지 않습니다.",
          details: message,
        },
      };
    }

    return {
      success: false,
      error: {
        code:
          typeof message === "string"
            ? message
            : this.defaultCode(status),
        message: this.messageFor(status, message),
        details: responseBody.details ?? null,
      },
    };
  }

  private defaultCode(status: number): string {
    return status >= HttpStatus.INTERNAL_SERVER_ERROR
      ? "INTERNAL_SERVER_ERROR"
      : "REQUEST_FAILED";
  }

  private messageFor(status: number, message: unknown): string {
    if (typeof message === "string" && !message.includes("_")) {
      return message;
    }

    return status >= HttpStatus.INTERNAL_SERVER_ERROR
      ? "서버에서 오류가 발생했습니다."
      : "요청을 처리할 수 없습니다.";
  }
}
