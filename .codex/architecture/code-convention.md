# 코드 작성 규칙

## 기본 방향

코드는 TypeScript와 NestJS 초급자가 읽고 실행 흐름을 따라갈 수 있게 작성한다. 초기 구현에서는 구조와 판단 근거를 주석으로 충분히 설명하고, 팀이 익숙해지면 코드만으로 명확한 반복 주석을 줄인다.

## 이름 규칙

- 파일명: kebab-case
- 클래스·인터페이스·타입·enum: PascalCase
- 변수·함수·메서드: camelCase
- 상수: UPPER_SNAKE_CASE
- Boolean: `is`, `has`, `can`, `should` 등 의미가 드러나는 접두사 사용

```text
workout-record.controller.ts
create-workout.request.ts
WorkoutRecordController
CreateWorkoutRequest
createWorkout
isCompleted
```

## NestJS 책임

- Controller: HTTP 요청·응답 변환과 인증 주체 전달
- Application Service: 유스케이스 진입점과 Component 실행 순서 조합
- Component: 하나의 명확한 애플리케이션 책임
- Domain: Entity, Value Object, 도메인 규칙과 불변식
- Repository Port: 저장소 추상화
- Infrastructure: Prisma와 외부 기술 구현

Controller에 비즈니스 로직을 넣거나 Service에서 Prisma 세부 구현을 직접 퍼뜨리지 않는다.

## 타입과 비동기

- `any`는 사용하지 않는다. 타입을 모르면 `unknown`을 사용하고 검증한다.
- 함수의 입력과 반환 타입을 명시한다.
- 비동기 작업은 `async/await`를 기본으로 사용한다.
- 처리하지 않는 Promise를 남기지 않는다.
- 외부 입력은 TypeScript 타입뿐 아니라 DTO 런타임 검증을 수행한다.

## 매개변수

- 매개변수가 적고 의미가 명확하면 직접 전달한다.
- 매개변수가 많거나 같은 타입이 반복되면 Command·Params 객체로 묶는다.
- 객체 매개변수의 필드는 `readonly`를 우선 검토한다.
- 위치와 순서 때문에 실수할 수 있는 원시값 여러 개를 연속으로 전달하지 않는다.

```ts
findById(userId: string): Promise<User | null>

createWorkout(command: CreateWorkoutCommand): Promise<Workout>
```

```ts
type CreateWorkoutCommand = {
  readonly userId: string;
  readonly exerciseId: string;
  readonly repetitions: number;
  readonly weight?: number;
  readonly durationSeconds?: number;
};
```

## 정적 팩토리 메서드

정적 팩토리 메서드는 모든 객체에 적용하지 않는다. 생성 시 도메인 규칙이나 불변식 검증이 필요한 Domain Entity에 사용한다.

```ts
export class Workout {
  private constructor(
    readonly id: string,
    readonly repetitions: number,
    readonly weight?: number,
  ) {}

  static create(params: CreateWorkoutParams): Workout {
    if (params.repetitions <= 0) {
      throw new InvalidWorkoutError();
    }

    return new Workout(
      params.id,
      params.repetitions,
      params.weight,
    );
  }
}
```

```text
Request DTO       → 일반 클래스와 Validation
Response DTO      → Mapper 변환
Domain Entity     → 필요할 때 static create
단순 데이터 객체  → 일반 생성자 또는 객체 리터럴
```

정적 팩토리 메서드는 생성 규칙을 한곳에 모으고 잘못된 Entity 생성을 막기 위한 수단이다. 단순한 데이터 전달 객체에 무조건 적용하지 않는다.

## DTO와 변환

- Request DTO는 입력 구조와 Validation만 담당한다.
- Response DTO는 외부 출력 구조만 담당한다.
- Domain Entity와 Prisma Model을 외부 응답으로 직접 반환하지 않는다.
- Domain·Prisma 결과와 DTO 변환은 Mapper가 담당한다.
- Request 이름은 행위 기준, Response 이름은 자원·표현 목적 기준으로 작성한다.

```text
CreateWorkoutRequest
UpdateWorkoutRequest
WorkoutResponse
WorkoutListItemResponse
```

## 주석 규칙

주석은 코드가 무엇을 하는지 반복하기보다, 왜 필요한지와 어떤 흐름을 타는지 설명한다.

### 자세히 설명할 대상

- NestJS Module과 의존성 주입
- Controller → Application Service → Component 흐름
- DTO 검증과 Domain 재검증의 차이
- Repository Port와 Prisma 구현체의 관계
- 이벤트를 사용하는 이유와 처리 시점
- 트랜잭션 경계
- 소유권·권한·도메인 불변식
- 복잡한 조건과 계산의 판단 근거

### 주석 예시

```ts
/**
 * 운동 기록 등록 유스케이스를 실행한다.
 *
 * 1. 운동 기록을 검증하고 저장한다.
 * 2. 저장된 기록을 기준으로 캐릭터 진행도를 갱신한다.
 *
 * Service는 세부 계산을 직접 처리하지 않고
 * 각 Component의 실행 순서만 조합한다.
 */
async createWorkout(command: CreateWorkoutCommand) {
  // 운동 기록 저장을 담당하는 Component에 작업을 위임한다.
  const workout = await this.workoutRecordCreator.create(command);

  // 기록 저장 이후 캐릭터 진행도를 갱신한다.
  await this.characterProgressUpdater.update({
    userId: command.userId,
    workoutId: workout.id,
  });

  // 외부 API에는 Domain Entity가 아닌 Response DTO를 반환한다.
  return WorkoutMapper.toResponse(workout);
}
```

### 줄일 수 있는 주석

아래처럼 코드만 읽어도 의미가 명확한 주석은 익숙해진 뒤 제거한다.

```ts
// 운동 기록을 저장한다.
await repository.save(workout);
```

초기에는 핵심 흐름을 설명하는 주석을 유지하고, 반복적인 문법 설명부터 줄인다.

## 로깅

- `console.log` 대신 공통 Logger를 사용한다.
- 비밀번호·토큰·개인정보를 로그에 남기지 않는다.
- 오류 원인은 로그에 기록하되 외부 응답에는 노출하지 않는다.
