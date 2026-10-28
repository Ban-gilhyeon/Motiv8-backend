# Platform Domain

## Scope

API, 데이터 저장, 테스트, 문서화, 배포와 확장성에 관한 공통 기술 정책을 관리한다.

## Decisions

- TypeScript와 Node.js를 사용한다.
- NestJS로 모듈·컨트롤러·서비스 구조를 만든다.
- Prisma로 PostgreSQL 스키마와 데이터 접근을 관리한다.
- 웹 클라이언트와 추후 모바일 앱이 동일 API를 사용한다.
- Swagger로 API 계약을 문서화한다.
- Jest 기반 테스트로 핵심 규칙과 실패 상황을 검증한다.

## Rules

- Controller는 요청·응답 흐름에 집중한다.
- DTO에서 외부 입력을 검증한다.
- 비즈니스 규칙은 Service 또는 도메인 로직에서 보장한다.
- 여러 데이터를 함께 변경하면 트랜잭션 필요성을 검토한다.
- API 오류는 일관된 응답 형식으로 반환한다.
- 로그에는 비밀번호, 토큰, 민감한 개인정보를 남기지 않는다.
- 기능은 모듈화해 인증, 운동, 진행, 알림, 소셜 기능을 독립적으로 확장한다.

## Initial MVP

1. 인증
2. 운동 종목
3. 루틴
4. 운동 기록
5. 운동 일지
6. 부위별 통계

추천·알림·배지·친구 경쟁·아바타 이미지 고도화는 MVP 이후 확장한다.

## Open Questions

- 배포 플랫폼과 CI/CD 방식은 무엇인가?
- Redis와 MongoDB를 도입할 시점은 언제인가?
- 모바일 전환은 Capacitor, React Native, Flutter 중 무엇으로 할 것인가?
