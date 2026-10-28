# 운영 규칙 문서 목록

운영 문서는 API에서 발생하는 실패를 일관되게 처리하고, 로그·상태 코드·검증 정책을 관리한다.

- [예외 처리 개요](error-handling.md): 예외 분류와 처리 흐름
- [에러 코드](error-code.md): 서비스 에러 코드 작성 규칙
- [전역 예외 필터](global-filter.md): NestJS `ExceptionFilter` 정책
- [검증과 HTTP 상태](validation-http.md): 입력·인증·권한·리소스 오류
- [금지 규칙](rules.md): 민감 정보와 잘못된 예외 처리 방지
- [로그 수집과 운영 관측](logging.md): 구조화 로그, request ID, 배포 환경 수집

도메인 불변식은 `.codex/domain/` 문서, 외부 응답 계약은 `.codex/api/` 문서를 함께 확인한다.
