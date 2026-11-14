# Motiv8 백엔드

Motiv8은 운동 기록을 바탕으로 사용자의 지속적인 운동을 돕는 동기부여형 운동 관리 서비스다.

사용자가 운동 루틴과 기록을 저장하면 운동 일지, 부위별 통계, 캐릭터 변화, 운동 추천과 알림으로 연결하는 것을 목표로 한다. 초기에는 웹 클라이언트와 연동되는 백엔드를 구축하고, 이후 모바일 앱으로 확장할 수 있는 API 구조를 지향한다.

> 현재는 서비스 구현 초기 단계다. 아래 내용은 확정된 제품 방향과 구현 예정 범위를 정리한 것이며, 아직 구현 완료된 기능을 의미하지 않는다.

## 프로젝트 목표

- 운동 결과를 캐릭터 변화로 시각화해 지속적인 운동을 유도한다.
- 운동 방식과 타겟 부위를 기준으로 기록을 구조화한다.
- 일별·월별 운동 일지와 부위별 운동량을 제공한다.
- 사용자 목표와 부족한 부위를 기반으로 운동 추천을 제공한다.
- 웹과 모바일 클라이언트가 함께 사용할 수 있는 백엔드 API를 설계한다.
- 기능 확장과 유지보수를 고려해 도메인 중심 구조를 적용한다.

## 주요 도메인

- 인증: 회원가입, 로그인, Access Token·Refresh Token 기반 인증
- 사용자: 사용자 프로필과 신체 정보
- 운동: 운동 종목, 운동 방식, 타겟 부위
- 운동 기록: 루틴, 세트, 반복 횟수, 무게, 시간
- 운동 일지: 날짜별 기록과 월별 달력 조회
- 캐릭터: 운동량에 따른 단계와 외형 변화
- 추천: 목표와 부위별 운동량을 기반으로 한 운동 추천
- 알림: 운동 리마인드, 목표 달성, 부족한 부위 알림
- 소셜: 친구 추가와 운동 기록 비교·경쟁

## 기술 스택

| 구분 | 기술 |
|---|---|
| 런타임 | Node.js |
| 언어 | TypeScript |
| 프레임워크 | NestJS |
| API | REST API |
| ORM | Prisma |
| 데이터베이스 | PostgreSQL |
| 인증 | Passport, JWT, Argon2 |
| 입력 검증 | class-validator, class-transformer |
| 테스트 | Jest, Supertest |
| 코드 품질 | Prettier, oxlint |
| 관측성 | 추후 별도 로그·모니터링 도구 검토 |

## 구조 방향

도메인 규칙을 중심으로 `Presentation → Application → Domain` 흐름을 구성한다. 데이터베이스와 외부 기술은 Infrastructure에서 담당하고, Application과 Domain이 구체적인 저장 기술에 직접 의존하지 않도록 Port와 Adapter를 활용한다.

각 도메인은 기능 단위로 분리하며, Service는 유스케이스의 흐름을 조율하고 세부 책임은 Component 또는 Domain Entity가 담당한다. 모듈 간 강한 결합을 피하기 위해 우선 동기 호출을 사용하고, 알림·통계·캐릭터 갱신처럼 결합도를 낮출 수 있는 작업은 이벤트 기반 처리를 검토한다.

## 인증 방향

- Access Token은 짧은 만료 시간을 사용한다.
- Refresh Token은 더 긴 만료 시간을 사용한다.
- Refresh Token 원문은 저장하지 않고 해시값과 만료·폐기 정보를 저장한다.
- 클라이언트는 앱 전환을 고려해 토큰을 `Authorization` 헤더로 전달한다.
- 인증이 필요한 API는 NestJS Guard에서 토큰을 검증한다.

## 개발 명령어

```bash
npm install
npm run start:dev
npm test
npm run build
npm run lint
```

## 문서

상세한 도메인 요구사항과 구현 규칙은 [`AGENTS.md`](AGENTS.md)와 [`.codex/`](.codex/) 문서를 확인한다.

- 도메인 요구사항: `.codex/domain/`
- 아키텍처 규칙: `.codex/architecture/`
- 저장소·Prisma 규칙: `.codex/persistence/`
- 운영·로그·예외 처리: `.codex/operation/`
- 포트폴리오 기록: `.codex/portfolio/`
