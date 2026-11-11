import { HttpStatus } from "@nestjs/common";
import { DomainException } from "../../../../common/errors/domain.exception";

export class AuthException extends DomainException {
  private constructor(code: string, message: string, status: number) {
    super(code, status, message);
  }

  static userAlreadyExists(): AuthException {
    return new AuthException(
      "USER_ALREADY_EXISTS",
      "이미 가입된 이메일입니다.",
      HttpStatus.CONFLICT,
    );
  }

  static invalidCredentials(): AuthException {
    return new AuthException(
      "INVALID_CREDENTIALS",
      "이메일 또는 비밀번호가 올바르지 않습니다.",
      HttpStatus.UNAUTHORIZED,
    );
  }

  static invalidRefreshToken(): AuthException {
    return new AuthException(
      "INVALID_REFRESH_TOKEN",
      "유효하지 않은 Refresh Token입니다.",
      HttpStatus.UNAUTHORIZED,
    );
  }

  static userNotFound(): AuthException {
    return new AuthException(
      "USER_NOT_FOUND",
      "사용자를 찾을 수 없습니다.",
      HttpStatus.UNAUTHORIZED,
    );
  }
}
