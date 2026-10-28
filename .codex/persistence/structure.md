# 데이터 저장 구조

## 핵심 원칙

핵심 도메인은 Domain Entity와 Prisma Model을 분리한다. Domain은 비즈니스 규칙을 표현하고, Prisma Model은 데이터베이스 저장 구조를 표현한다.

```text
Domain Entity
      ↕ Mapper
Prisma Model
      ↕
PostgreSQL
```

## Domain Entity

- 운동량 계산과 상태 변경 같은 비즈니스 규칙을 가진다.
- 저장 기술과 Prisma 타입을 참조하지 않는다.
- 유효하지 않은 상태를 생성하거나 변경하지 못하게 한다.

## Prisma Model

- 테이블 컬럼·관계·인덱스·제약조건을 표현한다.
- 저장과 조회에 유리한 구조를 우선한다.
- 도메인 정책을 Prisma schema에 과도하게 넣지 않는다.

## Repository Port

핵심 유스케이스는 Domain 또는 Application에 Repository Port를 정의한다.

```text
WorkoutRepositoryPort
        ↑ 구현
PrismaWorkoutRepository
```

Infrastructure는 Port를 구현하고, NestJS Module에서 Provider token으로 연결한다.

## 적용 범위

- 분리 우선: User, Workout, Routine, Character, Goal
- 단순 조회: Prisma Projection과 Response DTO를 바로 사용 가능
- 모든 테이블에 Entity와 Port를 기계적으로 만들지 않는다.
