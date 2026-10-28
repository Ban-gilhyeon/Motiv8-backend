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

## 테스트 구문 규칙

### 구조

테스트는 다음 구조를 사용한다.

```text
describe(대상 기능)
└── describe(조건 또는 상황)
    └── it(기대 결과)
```

`describe`는 구현 클래스보다 사용자의 기능과 조건을 설명한다.

### Given·When·Then

- `Given`: 사용자, 데이터, 상태, Mock 등 전제조건
- `When`: 실행한 유스케이스 또는 외부 행동
- `Then`: 결과, 상태 변화, 중요한 협력 객체 검증
- 주석은 코드 자체가 아니라 테스트 의도와 흐름을 설명한다.
- 한 줄 설명은 `// Given: ...`, `// When: ...`, `// Then: ...` 형식을 사용한다.
- 두 줄 이상 설명이 필요하면 `// Given`, `// When`, `// Then`을 별도 줄에 작성하고 아래에 흐름을 설명한다.

```ts
// Given: 인증된 사용자와 유효한 운동 기록이 준비되어 있다.
const given = createWorkoutFixture();

// When: 운동 기록 등록 유스케이스를 실행한다.
const result = await given.service.createWorkout(given.command);

// Then: 운동 기록 응답을 반환한다.
expect(result).toMatchObject({
  id: "workout-1",
});
```

복잡한 흐름은 단계명을 별도 줄로 분리한다.

```ts
// When
// 운동 기록 등록 유스케이스를 실행한다.
// 기록 저장 성공 후 캐릭터 진행도 갱신 흐름을 탄다.
const result = await given.service.createWorkout(given.command);
```

### Fixture와 Mock

- 반복되는 입력과 Mock 구성은 Fixture 또는 Builder로 분리한다.
- Domain 규칙은 실제 객체로 테스트하고, DB·외부 API·시간·랜덤 값만 외부 경계로 Mock한다.
- Mock 호출 횟수보다 유스케이스 결과를 우선 검증한다.
- 호출 검증은 저장·발행 등 중요한 협력 경계에만 사용한다.

### 안정성

- 시간과 랜덤 값은 고정한다.
- 에러 메시지 전체보다 에러 타입 또는 에러 코드를 검증한다.
- 테스트 간 Mock과 상태가 공유되지 않게 초기화한다.
- 테스트 순서가 바뀌어도 결과가 달라지지 않아야 한다.

## 예시

```ts
describe("운동 기록 등록", () => {
  describe("유효한 운동 기록인 경우", () => {
    it("기록을 저장하고 캐릭터 진행도를 갱신한다", async () => {
      // Given
      // 인증된 사용자와 저장 가능한 운동 기록이 준비되어 있다.
      const given = createWorkoutFixture();
      given.workoutRepository.save.mockResolvedValue({
        id: "workout-1",
        ...given.command,
      });

      // When
      // 운동 기록 등록 유스케이스를 실행한다.
      // 기록 저장 성공 후 캐릭터 진행도 갱신 흐름을 탄다.
      const result = await given.service.createWorkout(given.command);

      // Then
      // 외부 응답 결과와 핵심 협력 객체의 호출을 검증한다.
      expect(result).toMatchObject({ id: "workout-1" });
      expect(given.workoutRepository.save).toHaveBeenCalledTimes(1);
      expect(given.characterProgressUpdater.update).toHaveBeenCalledWith({
        userId: given.command.userId,
        workoutId: "workout-1",
      });
    });
  });

  describe("운동 방식과 입력값이 맞지 않는 경우", () => {
    it("검증 오류를 반환하고 저장하지 않는다", async () => {
      // Given
      // 시간 기반 운동에 무게와 횟수만 입력된 잘못된 요청이다.
      const given = createWorkoutFixture({
        mode: "DURATION",
        weight: 60,
        repetitions: 10,
        durationSeconds: undefined,
      });

      // When
      // 잘못된 운동 기록 등록을 실행한다.
      const action = () => given.service.createWorkout(given.command);

      // Then
      // 도메인 오류 코드와 저장 방지를 검증한다.
      await expect(action()).rejects.toMatchObject({
        code: "INVALID_WORKOUT_MEASUREMENT",
      });
      expect(given.workoutRepository.save).not.toHaveBeenCalled();
    });
  });
});
```

이 예시는 실제 구현 전 테스트 구조를 설명하기 위한 형태다. `createWorkoutFixture`는 테스트 데이터와 외부 경계 Mock을 한 곳에서 구성한다.
