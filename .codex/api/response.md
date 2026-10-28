# 응답 DTO 규칙

## 이름 규칙

Response DTO는 반환하는 자원과 표현 목적을 기준으로 이름을 정한다.

- 단건: `UserResponse`
- 목록 항목: `UserListItemResponse`
- 요약: `UserSummaryResponse`
- 파일명은 kebab-case를 사용한다. 예: `user.response.ts`
- 의미가 없는 `Response`, `UserDto`, `CommonResponse` 같은 이름은 사용하지 않는다.

- Domain 객체와 Prisma 결과를 직접 반환하지 않는다.
- Response DTO가 외부 API 계약을 담당한다.
- 민감한 인증 정보와 불필요한 내부 필드는 제외한다.
- 응답의 날짜·시간·enum 직렬화 형식을 일관되게 유지한다.
- 생성·수정·삭제 결과는 클라이언트가 다음 행동을 알 수 있게 반환한다.

## 공통 응답

성공과 실패 응답의 기본 구조는 구현 전에 확정하고 모든 API에 일관되게 적용한다.

```json
{
  "success": true,
  "data": {},
  "meta": null
}
```

실패 응답 예시:

```json
{
  "success": false,
  "error": {
    "code": "WORKOUT_NOT_FOUND",
    "message": "운동 기록을 찾을 수 없습니다."
  }
}
```

## 목록과 상세

- 목록은 요약 정보와 `meta`를 반환한다.
- 상세는 해당 기능에 필요한 정보만 반환한다.
- 다른 사용자의 데이터와 내부 식별자를 노출하지 않는다.

## 변환 규칙

- Request DTO는 외부 입력 구조와 검증만 담당한다.
- Response DTO는 외부 출력 구조만 담당한다.
- Domain 또는 Prisma 결과와 DTO의 변환은 Mapper가 담당한다.
- Domain 객체와 Prisma 결과를 Controller에서 직접 반환하지 않는다.

예시:

```text
CreateWorkoutRequest
UpdateWorkoutRequest
WorkoutResponse
WorkoutListItemResponse
```
