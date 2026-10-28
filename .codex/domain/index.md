# Motiv8 Domain Index

## Project Summary

Motiv8은 운동 기록을 바탕으로 운동 일지, 통계, 아바타 진행도, 추천과 알림을 제공하는 운동관리 서비스다. 웹으로 먼저 개발하고 API를 재사용해 모바일 앱으로 확장한다.

## Domain Documents

- [Auth](auth.md): 사용자, 인증, 권한, 개인정보
- [Exercise](exercise.md): 운동 종목, 운동 방식, 타겟 부위
- [Workout](workout.md): 루틴, 운동 기록, 일지, 통계
- [Progress](progress.md): 목표, 아바타, 배지, 추천
- [Notification](notification.md): 리마인드와 알림 정책
- [Social](social.md): 친구, 기록 공유, 경쟁
- [Platform](platform.md): API, 저장, 테스트, 배포, 확장성

## Cross-Domain Terms

- User: 운동 데이터의 소유자
- Exercise: 수행 가능한 개별 운동
- Routine: 반복 수행을 위해 구성한 운동 계획
- Workout Record: 특정 시점에 실제 수행한 운동 결과
- Body Part: 운동이 기여하는 신체 부위
- Goal: 사용자가 달성하려는 운동 기준

## Documentation Rules

- 모든 Markdown 문서는 200줄 이하로 유지한다.
- 새 기능은 가장 가까운 도메인 문서에 기록한다.
- 도메인 경계를 넘는 규칙은 이 문서가 아니라 관련 도메인 문서에 명시한다.
- 확정되지 않은 정책은 각 문서의 `Open Questions`에 기록한다.
