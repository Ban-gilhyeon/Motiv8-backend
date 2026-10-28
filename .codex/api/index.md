# API 문서 목록

API 문서는 HTTP 계약과 외부에 노출되는 규칙을 관리한다. 도메인 정책은 `.codex/domain/` 문서를 기준으로 한다.

- [공통 규칙](conventions.md): URL, HTTP 메서드, 이름, 버전
- [요청 DTO](request.md): DTO, 입력 검증, 입력 규칙
- [응답 DTO](response.md): 응답 구조, 목록, 상세, 민감 정보
- [인증](authentication.md): JWT, 사용자 식별, 소유권
- [페이지네이션](pagination.md): 목록 조회, 정렬, 날짜 범위

## 추가로 정할 API 문서

- 에러 코드와 예외 응답: `.codex/operation/`
- Swagger 작성 규칙: `conventions.md`에 추가 예정
- API 계약 변경과 하위 호환성: 기능이 늘어날 때 별도 문서화

구현 전 해당 기능의 도메인 문서와 이 인덱스에서 연결된 API 문서를 함께 확인한다.
