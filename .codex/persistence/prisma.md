# Prisma 규칙

## Schema

- 모델명과 필드명은 도메인 용어와 일치시킨다.
- nullable, unique, relation, index를 명시적으로 검토한다.
- 인증 정보와 개인정보는 필요한 범위만 저장한다.
- Prisma Model 타입을 Controller 응답으로 직접 노출하지 않는다.

## Migration

- schema 변경은 migration으로 관리한다.
- 기존 데이터를 보존하는 방향을 우선한다.
- 컬럼 삭제·타입 변경 등 파괴적 변경은 backfill과 롤백 방법을 먼저 검토한다.
- migration 적용 전 로컬 테스트를 수행한다.

## Relation and Index

- 사용자 소유 데이터는 User와의 관계를 명시한다.
- 운동 기록 조회 조건에 필요한 사용자·날짜·부위 인덱스를 검토한다.
- 목록 조회에서 불필요한 relation include를 사용하지 않는다.
- N+1 가능성이 있는 관계 조회는 쿼리 수를 확인한다.
