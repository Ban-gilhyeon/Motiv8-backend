import { describe, expect, it, jest } from "@jest/globals";
import { AuthService } from "./auth.service";
import { AuthException } from "../domain/errors/auth.exception";
import { User } from "../domain/entities/user.entity";

describe("회원가입과 로그인", () => {
  const createFixture = () => {
    const userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };
    const passwordHasher = {
      hash: jest.fn(),
      verify: jest.fn(),
    };
    const refreshTokenRepository = {
      save: jest.fn(),
      findActiveByUserId: jest.fn(),
      revoke: jest.fn(),
    };
    const tokenIssuer = {
      issue: jest.fn(),
      hashRefreshToken: jest.fn().mockReturnValue("refresh-token-hash"),
      refreshTokenExpiresAt: jest.fn().mockReturnValue(new Date()),
    };

    return {
      service: new AuthService(
        userRepository,
        refreshTokenRepository,
        passwordHasher,
        tokenIssuer,
      ),
      userRepository,
      refreshTokenRepository,
      passwordHasher,
      tokenIssuer,
    };
  };

  describe("유효한 회원가입 요청인 경우", () => {
    it("비밀번호를 해시하고 사용자와 토큰을 생성한다", async () => {
      // Given: 중복되지 않은 이메일과 유효한 회원가입 정보가 준비되어 있다.
      const given = createFixture();
      const user = User.create({
        id: "user-1",
        email: "user@example.com",
        passwordHash: "hashed-password",
        nickname: "길현",
      });
      given.userRepository.findByEmail.mockResolvedValue(null);
      given.passwordHasher.hash.mockResolvedValue("hashed-password");
      given.userRepository.save.mockResolvedValue(user);
      given.tokenIssuer.issue.mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });

      // When: 회원가입 유스케이스를 실행한다.
      const result = await given.service.signup({
        email: "user@example.com",
        password: "password123",
        nickname: "길현",
      });

      // Then: 해시된 비밀번호로 저장하고 인증 토큰을 반환한다.
      expect(given.passwordHasher.hash).toHaveBeenCalledWith("password123");
      expect(given.userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          props: expect.objectContaining({ passwordHash: "hashed-password" }),
        }),
      );
      expect(result.accessToken).toBe("access-token");
    });
  });

  describe("이미 가입된 이메일인 경우", () => {
    it("중복 가입 오류를 반환하고 저장하지 않는다", async () => {
      // Given: 같은 이메일을 가진 사용자가 이미 존재한다.
      const given = createFixture();
      given.userRepository.findByEmail.mockResolvedValue(
        User.create({
          id: "user-1",
          email: "user@example.com",
          passwordHash: "hashed-password",
          nickname: "기존 사용자",
        }),
      );

      // When: 중복 이메일로 회원가입을 실행한다.
      const action = () =>
        given.service.signup({
          email: "user@example.com",
          password: "password123",
          nickname: "새 사용자",
        });

      // Then: 중복 오류가 발생하고 사용자 저장은 호출되지 않는다.
      await expect(action()).rejects.toBeInstanceOf(AuthException);
      expect(given.userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("비밀번호가 일치하지 않는 경우", () => {
    it("인증 오류를 반환한다", async () => {
      // Given: 이메일에 해당하는 사용자는 있지만 비밀번호 검증에 실패한다.
      const given = createFixture();
      given.userRepository.findByEmail.mockResolvedValue(
        User.create({
          id: "user-1",
          email: "user@example.com",
          passwordHash: "hashed-password",
          nickname: "길현",
        }),
      );
      given.passwordHasher.verify.mockResolvedValue(false);

      // When: 잘못된 비밀번호로 로그인을 실행한다.
      const action = () =>
        given.service.login({
          email: "user@example.com",
          password: "wrong-password",
        });

      // Then: 구체적인 계정 상태를 노출하지 않고 인증 오류를 반환한다.
      await expect(action()).rejects.toBeInstanceOf(AuthException);
      expect(given.tokenIssuer.issue).not.toHaveBeenCalled();
    });
  });
});
