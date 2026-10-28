# 기술 선택과 아키텍처 결정

## Node.js와 TypeScript

Node.js 기반 백엔드 회사 지원을 목표로 TypeScript를 사용한다. TypeScript의 타입 검사를 통해 API 계약과 도메인 데이터 구조를 명확하게 관리한다.

## NestJS

NestJS는 Module·Controller·Provider·Dependency Injection 구조를 제공해 Spring 경험을 확장하기 좋다. 기능별 모듈 경계를 기반으로 유지보수 가능한 모듈형 모놀리스를 구성한다.

## 모듈형 모놀리스

초기에는 하나의 애플리케이션으로 빠르게 개발하고 배포한다. `auth`, `exercise`, `workout`, `character` 같은 기능 경계를 분리해 추후 서비스 분리 가능성을 남긴다.

## 헥사고날에 가까운 레이어

```text
Presentation → Application → Domain
Infrastructure → Domain
```

Application Service는 Facade로 유스케이스를 조합하고, Domain은 핵심 규칙을 담당한다. Infrastructure는 Port 구현체로 Prisma와 외부 시스템을 연결한다.

## Entity와 Prisma Model 분리

핵심 규칙이 있는 User·Workout·Routine·Character·Goal은 Domain Entity와 Prisma Model을 분리한다. 단순 조회는 Projection과 Response DTO를 사용해 불필요한 추상화를 줄인다.

## 모듈 간 통신

- 즉시 결과가 필요한 핵심 처리는 Application Port·Facade 직접 호출
- 알림·배지·분석처럼 후속 처리는 Event 검토
- 같은 애플리케이션 내부에서 모듈 간 REST 호출은 사용하지 않음
