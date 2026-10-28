# Motiv8 백엔드 작업 가이드

## 프로젝트 맥락

Motiv8은 사용자의 운동 기록을 바탕으로 운동 일지, 부위별 통계, 아바타 진행도, 추천과 알림을 제공하는 운동관리 서비스다.

현재 백엔드 목표 스택:

- Runtime: Node.js
- Language: TypeScript
- Framework: NestJS
- ORM: Prisma
- Database: PostgreSQL

## 필수 문서 확인 순서

모든 구현 작업은 아래 순서로 문서를 확인한다.

1. 이 문서(`AGENTS.md`)
2. [`/.codex/domain/index.md`](.codex/domain/index.md)
3. 구현 대상에 해당하는 기능 문서
4. 관련 코드와 테스트

문서와 코드가 충돌하면 현재 구현을 그대로 따르지 말고, 요구사항을 확인한 뒤 문서 또는 코드를 갱신한다. 확정되지 않은 정책은 임의로 확정하지 않고 `Open Questions`에 기록한다.

## 문서 라우팅

작업 시작 전에 작업 유형에 해당하는 문서를 읽는다.

| 구현 영역 | 먼저 확인할 문서 | 함께 확인할 도메인 개념 |
|---|---|---|
| 회원가입·로그인·JWT·인가 | `.codex/domain/auth.md` | 사용자, 소유권, 개인정보 |
| 사용자 프로필·신체 정보 | `.codex/domain/auth.md`, `.codex/domain/character.md` | 사용자, 캐릭터 |
| 운동 종목 CRUD | `.codex/domain/exercise.md` | 운동 종목, 운동 방식, 타겟 부위 |
| 루틴 생성·수정·조회 | `.codex/domain/workout.md` | 루틴, 운동 종목 |
| 운동 기록 저장·수정·삭제 | `.codex/domain/workout.md` | 운동 기록, 세트, 반복 횟수, 무게, 시간 |
| 운동 일지·달력 조회 | `.codex/domain/workout.md` | 날짜별 기록, 월별 조회 |
| 부위별 통계 | `.codex/domain/workout.md`, `.codex/domain/character.md` | 운동량 산정, 타겟 부위 |
| 캐릭터 단계·외형 변화 | `.codex/domain/character.md` | 운동량, 목표, 단계 |
| 운동 추천 | `.codex/domain/character.md` | 목표, 부족한 부위 |
| 목표·배지 | `.codex/domain/character.md` | 목표 달성, 달성 이력 |
| 알림·스케줄러 | `.codex/domain/notification.md` | 운동 시점, 목표, 부족 부위 |
| 친구·경쟁 기능 | `.codex/domain/social.md` | 친구, 공개 범위, 경쟁 |
| Prisma 스키마·마이그레이션 | `.codex/domain/platform.md` 및 관련 도메인 문서 | 엔티티 관계, 소유권, 삭제 정책 |
| REST API·DTO·Swagger | 해당 기능의 개념·플로우·예외 케이스 | 요청 검증, 응답 의미 |
| 테스트 | 해당 기능의 `Business Rules`, `Edge Cases` | 정상·실패·권한 시나리오 |
| 배포·관측성·로그 | `.codex/domain/platform.md` | 운영 환경, 자동 저장, 실패 복구 |
| 예외 처리·에러 응답 | `.codex/operation/` 및 해당 도메인 문서 | 에러 코드, HTTP 상태, 민감 정보 |
| 로그·운영 관측 | `.codex/operation/logging.md` | 구조화 로그, request ID, 개인정보, 수집 환경 |
| 모듈·레이어·의존성 | `.codex/architecture/` 및 해당 도메인 문서 | 모듈 경계, 레이어 책임, 의존 역전 |
| 모듈 간 통신 | `.codex/architecture/communication.md` | Facade, Port, Event, 동기·비동기 처리 |
| Prisma·저장소·트랜잭션 | `.codex/persistence/` 및 해당 도메인 문서 | Entity 분리, Projection, Migration, 원자성 |
| Git 커밋·브랜치 작업 | `.codex/git/` | 커밋 prefix, 분리 기준, 검증 흐름 |

## 구현 규칙

- 도메인 규칙은 Controller가 아니라 Service 또는 도메인 로직에서 보장한다.
- Controller는 요청 파싱, 인증 정보 전달, 응답 반환에 집중한다.
- DTO에서 외부 입력을 검증한다.
- 사용자가 소유하지 않은 운동 기록은 ID를 알아도 접근할 수 없어야 한다.
- 운동 방식에 맞지 않는 무게·횟수·시간 입력은 저장하지 않는다.
- 운동 기록 수정·삭제가 통계·아바타·목표에 영향을 주면 재계산 정책을 적용한다.
- 여러 데이터를 함께 변경하는 작업은 트랜잭션 필요성을 검토한다.
- 구현 전에 관련 문서의 `Open Questions`를 확인하고, 결정이 필요한 경우 근거를 남긴다.
- 외부 입력, 인증, 권한, 개인정보를 신뢰하지 않는다.
- 새 기능은 단위 테스트 또는 통합 테스트를 함께 추가한다.

## 문서 갱신 규칙

구현으로 도메인 규칙이나 정책이 확정·변경되면 코드만 수정하지 않는다.

1. 관련 `.codex/domain/*.md` 문서의 기존 내용을 확인한다.
2. 확정된 규칙·플로우·예외를 현재형으로 반영한다.
3. 더 이상 맞지 않는 `Open Questions`는 제거하거나 결정된 내용으로 이동한다.
4. 구현 로그나 임시 디버깅 내용은 문서에 남기지 않는다.

## 검증 체크리스트

작업 종료 전 아래를 확인한다.

- 관련 도메인 문서를 읽었는가?
- 요구사항과 구현이 일치하는가?
- 인증·소유권 검증이 있는가?
- 입력값과 실패 상황을 검증했는가?
- 관련 테스트를 추가하거나 실행했는가?
- API 변경사항을 README 또는 Swagger에 반영했는가?
- 확정된 도메인 지식을 관련 `.codex/domain/*.md` 문서에 반영했는가?
