# 요청 DTO 규칙

## 이름 규칙

Request DTO는 사용자의 행위를 기준으로 이름을 정한다.

- 생성: `CreateUserRequest`
- 수정: `UpdateUserRequest`
- 로그인: `LoginRequest`
- 목록 조건: `WorkoutQueryRequest`
- 파일명은 kebab-case를 사용한다. 예: `create-workout.request.ts`
- 의미가 없는 `Request`, `UserDto`, `CommonRequest` 같은 이름은 사용하지 않는다.

- Controller는 Request DTO를 받는다.
- 외부 입력은 `class-validator` 기반 DTO 검증을 거친다.
- DTO 타입 선언은 입력 형태를 설명하며 런타임 검증을 대체하지 않는다.
- 등록과 수정의 규칙이 다르면 DTO를 분리한다.
- enum은 API에서 명시된 문자열 값을 사용한다.
- 사용자 ID와 소유자 ID는 요청값으로 받지 않고 인증 주체에서 결정한다.
- 도메인 불변식은 DTO 검증 이후 Service 또는 Domain에서 다시 검증한다.
- 숫자 입력은 음수·범위·소수 허용 여부를 명시한다.
- 운동 방식에 맞지 않는 무게·횟수·시간 입력은 거부한다.

## 입력 검증 오류

- 잘못된 필드는 필드명과 오류 이유를 반환한다.
- 내부 클래스명이나 stack trace는 외부 응답에 노출하지 않는다.
- 요청 검증 실패는 `400 Bad Request`를 사용한다.
