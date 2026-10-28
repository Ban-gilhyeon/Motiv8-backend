# 전역 예외 필터

## 책임

NestJS의 전역 `ExceptionFilter`는 애플리케이션에서 발생한 예외를 공통 HTTP 응답으로 변환한다.

- NestJS `HttpException` 처리
- DTO `ValidationPipe` 오류 처리
- 정의된 도메인 예외 처리
- 정의되지 않은 시스템 예외 처리
- request ID와 오류 로그 연결

## 응답 규칙

- 성공 응답과 구분되는 `success: false`를 반환한다.
- 에러 코드는 안정적인 문자열로 반환한다.
- HTTP 상태 코드와 에러 코드는 일관되게 매핑한다.
- stack trace와 내부 경로는 외부에 반환하지 않는다.
- Validation 오류는 필드별 details로 반환할 수 있다.

## 시스템 오류

정의되지 않은 오류는 `500 Internal Server Error`로 반환한다. 내부 로그에는 원인과 stack trace를 남기되 비밀번호·토큰·개인정보가 포함되지 않도록 한다.

## 로그

- request ID
- HTTP method와 path
- status code
- 에러 코드
- 안전한 사용자·리소스 식별자
- stack trace는 내부 로그에만 기록
