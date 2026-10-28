# 에러 코드 규칙

## 에러 코드 역할

에러 코드는 클라이언트가 메시지 문자열이 아니라 안정적인 값으로 실패 유형을 판단하도록 제공한다.

```text
WORKOUT_NOT_FOUND
WORKOUT_ACCESS_DENIED
INVALID_WORKOUT_MEASUREMENT
USER_ALREADY_EXISTS
```

## 작성 규칙

- 대문자·언더스코어 형식을 사용한다.
- 도메인 또는 기능 이름을 포함한다.
- 하나의 코드가 여러 의미를 갖지 않게 한다.
- 내부 예외명이나 DB 에러 문자열을 그대로 노출하지 않는다.
- 메시지는 사용자에게 보여도 되는 일반 설명만 포함한다.

## 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "WORKOUT_NOT_FOUND",
    "message": "운동 기록을 찾을 수 없습니다.",
    "details": null
  }
}
```

`details`에는 필드 검증 오류처럼 클라이언트가 수정에 사용할 수 있는 정보만 담는다.

## 도메인 예시

- `USER_NOT_FOUND`
- `INVALID_CREDENTIALS`
- `EXERCISE_NOT_FOUND`
- `ROUTINE_NOT_FOUND`
- `WORKOUT_NOT_FOUND`
- `WORKOUT_ACCESS_DENIED`
- `CHARACTER_STATE_NOT_FOUND`
