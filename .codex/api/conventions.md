# API 공통 규칙

## URL 규칙

- Base path는 `/api/v1`을 사용한다.
- 리소스는 복수형 명사를 사용한다. 예: `/workouts`, `/exercises`.
- 현재 인증 사용자는 `/me`를 사용한다.
- 리소스 식별자는 path parameter로 전달한다.
- 상태 변경은 명시적인 동사 path 또는 명확한 HTTP method로 표현한다.

## HTTP 메서드

- `GET`: 조회
- `POST`: 생성 또는 명시적인 command
- `PATCH`: 일부 변경
- `DELETE`: 삭제 또는 비활성화

## 기본 규칙

- API 버전은 URL에 포함한다.
- Controller는 HTTP 변환과 Service 호출만 담당한다.
- Domain 객체나 Prisma 결과를 그대로 반환하지 않는다.
- 모든 보호 API는 인증 주체와 리소스 소유권을 확인한다.
- Swagger에 목적, 인증 여부, 요청·응답 예시를 기록한다.

## 초기 리소스

- `/auth`: 회원가입, 로그인, 토큰
- `/exercises`: 운동 종목
- `/routines`: 루틴
- `/workouts`: 운동 기록
- `/workout-journals`: 운동 일지
- `/character`: 캐릭터 상태와 진행도

운동 종목 유형은 API에서 `WEIGHT`, `BODYWEIGHT`, `CARDIO` enum name을 사용한다.
