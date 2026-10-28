# 의존 방향과 의존 역전

## 기본 방향

논리적 의존 방향은 다음을 따른다.

```text
Presentation → Application → Domain
Infrastructure → Domain
```

Domain과 Application이 Infrastructure를 직접 참조하지 않는 것이 핵심이다.

## 의존 역전

Application 또는 Domain에 Port 인터페이스를 정의하고 Infrastructure가 구현한다.

```text
Domain/Application
└── WorkoutRepositoryPort

Infrastructure
└── PrismaWorkoutRepository implements WorkoutRepositoryPort
```

NestJS Module의 Provider 토큰으로 런타임 구현체를 연결한다.

```text
WORKOUT_REPOSITORY → PrismaWorkoutRepository
```

## 금지 사항

- Domain에서 Prisma Client import
- Application에서 Prisma 모델 타입 직접 사용
- Controller에서 Repository 직접 호출
- 모듈 내부 파일을 다른 모듈이 직접 import
- 다른 모듈의 내부 Component를 직접 호출
- 같은 애플리케이션 안에서 모듈 간 REST API 호출
- 공통 모듈을 통해 도메인 간 모든 의존성 우회

## 현실적인 적용

단순 조회 기능까지 모든 Port를 강제하지 않는다. 비즈니스 규칙이 있거나 교체 가능성이 있는 저장소·외부 연동부터 추상화한다.
