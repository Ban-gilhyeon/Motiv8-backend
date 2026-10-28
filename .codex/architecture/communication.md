# 모듈 간 통신

## 기본 원칙

Motiv8은 모듈형 모놀리스로 시작한다. 같은 애플리케이션 내부의 모듈끼리 REST API를 호출하지 않는다.

```text
외부 클라이언트 → REST API → NestJS 모듈
```

내부 모듈 통신은 Application Port·Facade 직접 호출 또는 이벤트를 사용한다.

## 동기 호출

호출 결과가 즉시 필요하거나 같은 유스케이스의 핵심 상태 변경인 경우 공개된 Application Port 또는 Facade를 호출한다.

```text
WorkoutService
    ↓
CharacterProgressPort
    ↓
CharacterService
```

적용 예:

- 운동 기록 저장 결과에 캐릭터 상태가 필요함
- 같은 트랜잭션에서 통계 또는 목표 상태를 변경함
- 호출 실패 시 전체 유스케이스를 실패시켜야 함

다른 모듈의 내부 Component나 Repository를 직접 호출하지 않는다.

## 이벤트 호출

호출자가 결과를 기다릴 필요가 없고 후속 기능을 느슨하게 연결해야 하는 경우 이벤트를 발행한다.

```text
WorkoutRecordedEvent
├── Character 진행도 갱신
├── Goal 달성 확인
└── Notification 생성
```

적용 예:

- 운동 기록 이후 알림 생성
- 목표 달성 여부 확인
- 추후 배지나 분석 기능 추가

이벤트 처리 실패가 핵심 운동 기록 저장을 실패시키지 않아야 하는 경우 이벤트를 우선 검토한다.

## 이벤트 규칙

- 이벤트 이름은 과거형 사실로 작성한다. 예: `WorkoutRecordedEvent`.
- 이벤트 payload에는 필요한 식별자와 최소 데이터만 담는다.
- 이벤트 핸들러는 중복 수신을 고려해 멱등적으로 만든다.
- 실패·재시도·순서 보장 정책을 기능별로 정한다.
- DB 커밋 전에 외부 전달이 발생하지 않도록 발행 시점을 검토한다.
- 모든 기능을 이벤트로 만들지 않는다.

## 통신 선택 기준

```text
즉시 결과 필요 + 핵심 변경
→ Application Port/Facade 직접 호출

후속 처리 + 느슨한 연결
→ Application/Domain Event

별도 배포 서비스 또는 외부 시스템
→ REST·메시지 브로커 검토
```

## 금지 사항

- 모듈 간 내부 REST 호출
- 다른 모듈의 Prisma Repository 직접 호출
- 다른 모듈의 내부 Component 직접 호출
- 이벤트 하나에 과도한 데이터를 담기
- 이벤트 발행만으로 트랜잭션 일관성이 보장된다고 가정하기
