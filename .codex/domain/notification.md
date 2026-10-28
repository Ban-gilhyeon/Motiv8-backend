# Notification Domain

## Scope

운동 리마인드, 목표 달성, 부족 부위 안내와 영양 관련 알림을 관리한다.

## Notification Types

- Workout Reminder: 이전 운동 시각 기준 다음 운동 안내
- Nutrition Reminder: 운동 종료 후 영양 섭취 안내
- Body Part Suggestion: 부족한 부위 운동 제안
- Goal Achievement: 주간 또는 개인 목표 달성 안내

## Rules

- 알림은 사용자의 운동 기록과 목표에 근거해야 한다.
- 같은 조건의 알림을 반복 발송하지 않도록 중복 정책이 필요하다.
- 사용자는 알림 종류 또는 수신 여부를 조정할 수 있어야 한다.
- 알림 실패는 기록하고 재시도 여부를 결정할 수 있어야 한다.

## Initial Scope

- 먼저 알림 조건과 대상 조회 API를 구현한다.
- 실제 웹 푸시·모바일 푸시는 배포 단계에서 연결한다.

## Open Questions

- 웹 푸시, 이메일, 모바일 푸시 중 우선 채널은 무엇인가?
- 사용자 시간대와 조용한 시간 정책은 무엇인가?
