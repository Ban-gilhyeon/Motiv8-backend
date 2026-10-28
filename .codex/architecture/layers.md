# 레이어 책임

## Presentation

- Controller
- Request·Response DTO
- HTTP 상태와 입력 변환
- 인증 주체 전달

비즈니스 규칙이나 Prisma 호출을 직접 처리하지 않는다.

## Application

- 사용자의 유스케이스
- 여러 도메인 흐름의 조합
- 트랜잭션 경계
- Domain과 Port 호출 순서 제어

Application Service는 Facade 역할을 한다. Controller는 Application Service만 호출하고, Service는 하위 Component를 조합한다.

```text
WorkoutService
├── WorkoutRecordCreator
├── WorkoutStatisticsCalculator
└── CharacterProgressUpdater
```

Component는 하나의 명확한 애플리케이션 책임만 가진다. 단순한 로직까지 무조건 Component로 분리하지 않는다.

HTTP 객체나 Prisma 세부 구현을 알지 않도록 한다.

## Domain

- Entity
- Value Object
- 도메인 서비스
- 도메인 불변식
- Repository·외부 시스템 Port 추상화

NestJS, Prisma, HTTP 같은 인프라 기술에 의존하지 않는다.

## Infrastructure

- Prisma Repository 구현
- 외부 API 연동
- 캐시·메시지·파일 저장소
- 프레임워크와 라이브러리 설정

Domain 또는 Application에 정의된 추상화(Port)를 구현한다.
