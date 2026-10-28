# 데이터 저장 문서 목록

Persistence 문서는 Domain Entity, Prisma Model, Repository, Query, Transaction의 책임과 선택 기준을 관리한다.

- [저장 구조](structure.md): Domain·Prisma·Repository 관계
- [Prisma 규칙](prisma.md): schema, migration, relation, index
- [조회와 Projection](query.md): 단순 조회와 응답 모델
- [트랜잭션](transaction.md): 원자적 변경과 경계

도메인 규칙은 `.codex/domain/`, 의존 방향은 `.codex/architecture/` 문서를 함께 확인한다.
