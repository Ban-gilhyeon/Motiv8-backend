# 테스트 경계

## Domain 테스트

- Entity와 Value Object의 불변식
- 운동량 계산
- 캐릭터 단계 변경
- 목표 달성 규칙

외부 DB나 NestJS 실행 없이 빠르게 검증한다.

## Application 테스트

- 유스케이스 흐름
- 권한·소유권 확인
- 여러 Port 호출 조합
- 트랜잭션이 필요한 상태 변경

Port는 테스트용 구현체나 Mock으로 대체한다.

## Infrastructure 테스트

- Prisma Repository 조회·저장
- 스키마 제약조건
- 트랜잭션 동작
- 실제 PostgreSQL과의 통합

## Presentation 테스트

- DTO 입력 검증
- Controller의 상태 코드와 응답 변환
- Guard와 Exception Filter 연결

모든 레이어를 같은 방식으로 테스트하지 않고 책임에 맞는 범위로 검증한다.
