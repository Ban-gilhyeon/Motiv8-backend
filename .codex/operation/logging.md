# 로그 수집과 운영 관측

## 목적

로그는 사용자 행동 기록이 아니라 서비스 상태와 오류 원인을 추적하기 위한 운영 데이터다. 운동 기록과 같은 도메인 데이터는 PostgreSQL에 저장하고, 로그에는 필요한 식별자와 처리 결과만 남긴다.

## 기본 원칙

- 로그는 구조화된 JSON 형식으로 남긴다.
- 한 요청의 로그를 `requestId`로 연결한다.
- 개발 환경에서는 사람이 읽기 쉬운 출력도 허용한다.
- 운영 환경에서는 수집 시스템이 검색할 수 있는 JSON을 사용한다.
- 비밀번호, JWT, refresh token, 개인정보, 요청 전문은 로그에 남기지 않는다.
- 로그에 남길 사용자 식별자는 내부 ID 또는 익명화된 값으로 제한한다.

## 로그 레벨

- `error`: 요청 실패, 예외, 외부 시스템 장애
- `warn`: 재시도, 예상 가능한 비정상 상태, 설정 누락
- `info`: 서버 시작, 주요 작업 완료, 배포 버전
- `debug`: 개발 중 상세 흐름과 쿼리 확인

운영 환경의 기본 레벨은 `info`로 두고, `debug`는 필요할 때만 일시적으로 활성화한다.

## 공통 필드

```json
{
  "timestamp": "2026-10-29T12:00:00.000Z",
  "level": "info",
  "service": "motiv8-backend",
  "environment": "production",
  "requestId": "request-id",
  "method": "GET",
  "path": "/api/v1/workouts",
  "statusCode": 200,
  "durationMs": 42,
  "message": "운동 기록 조회 완료"
}
```

## 요청 로그

- 요청 시작 또는 종료 시 request ID를 기록한다.
- method, path, status code, 처리 시간, 안전한 사용자 식별자를 기록한다.
- query와 body 전체를 기록하지 않는다.
- 인증 실패와 권한 거부는 원인 분석에 필요한 최소 정보만 기록한다.

## 오류 로그

- `errorCode`, request ID, path, status code를 포함한다.
- 시스템 오류는 내부 로그에 stack trace를 기록한다.
- 외부 응답 메시지와 내부 오류 상세를 분리한다.
- 동일 오류가 반복되면 알림 또는 집계 기준을 마련한다.

## 수집 방식

### 초기 개발

- 로컬에서는 stdout으로 출력한다.
- Docker 환경에서도 파일보다 stdout 수집을 우선한다.
- 로그 파일을 Git에 포함하지 않는다.

### 배포 환경

- 컨테이너 stdout을 AWS CloudWatch Logs 또는 배포 플랫폼 로그로 수집한다.
- 장기 보관 기간과 비용을 정한다.
- 로그 검색을 위해 service, environment, level, requestId 필드를 유지한다.

## NestJS 적용 방향

- NestJS Logger 또는 구조화 로거를 공통 LoggerService로 감싼다.
- HTTP 요청 종료 로그는 Interceptor에서 처리한다.
- 예외 로그는 전역 Exception Filter에서 처리한다.
- request ID 생성·전달은 Middleware 또는 Interceptor에서 처리한다.

## 보관과 점검

- 운영 로그 보관 기간은 비용과 장애 분석 필요성을 기준으로 정한다.
- 개인정보가 유입된 로그는 즉시 마스킹 정책을 보완한다.
- 배포 후 오류율, 5xx 비율, 평균 응답 시간, 느린 요청을 점검한다.

## 결정이 필요한 사항

- `nestjs-pino`와 기본 Logger 중 어떤 구조화 로거를 사용할 것인가?
- 배포 플랫폼은 CloudWatch Logs와 어떤 방식으로 연결할 것인가?
- 로그 보관 기간과 민감 정보 마스킹 목록은 무엇인가?
