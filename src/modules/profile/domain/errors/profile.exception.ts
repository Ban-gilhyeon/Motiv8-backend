import { HttpStatus } from "@nestjs/common";
import { DomainException } from "../../../../common/errors/domain.exception";

export class ProfileException extends DomainException {
  private constructor(code: string, message: string, status: number) { super(code, status, message); }

  static notFound(): ProfileException {
    return new ProfileException("PROFILE_NOT_FOUND", "프로필을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
  }

  static experienceMustBePositive(): ProfileException {
    return new ProfileException("EXPERIENCE_MUST_BE_POSITIVE", "경험치는 양수여야 합니다.", HttpStatus.BAD_REQUEST);
  }
}
