# 모듈 구조

## 기본 구조

```text
src/
├── modules/
│   ├── auth/
│   ├── exercise/
│   ├── workout/
│   ├── character/
│   └── notification/
├── common/
├── config/
└── prisma/
```

각 기능 모듈은 독립적인 경계를 가진다.

```text
modules/workout/
├── presentation/
├── application/
├── domain/
├── infrastructure/
└── workout.module.ts
```

## 모듈 규칙

- 모듈은 하나의 기능 또는 도메인 책임을 가진다.
- 다른 모듈의 내부 파일을 직접 import하지 않는다.
- 모듈 간 공개 기능은 Module의 `exports`로 명시한다.
- 도메인 간 흐름은 Application 레이어에서 조합한다.
- 처음부터 모든 모듈에 모든 레이어를 만들지 않는다.
- 기능이 단순하면 파일을 적게 시작하고 복잡해질 때 레이어를 분리한다.

## 공통 디렉터리

`common`에는 여러 모듈에서 실제로 공유하는 기술 횡단 관심사만 둔다.

- Guard
- Interceptor
- Exception Filter
- Decorator
- 공통 타입

특정 도메인 규칙이나 특정 모듈 전용 DTO는 `common`에 두지 않는다.
