# 아키텍처 문서 목록

Motiv8은 기능별 모듈을 가진 모듈형 모놀리스로 시작한다. 초기에는 하나의 NestJS 애플리케이션으로 배포하되, 모듈 경계를 지켜 추후 분리할 수 있게 설계한다.

- [모듈 구조](module-structure.md): 기능별 디렉터리와 레이어 구성
- [레이어 책임](layers.md): Presentation·Application·Domain·Infrastructure
- [의존 방향](dependency-rules.md): 단방향 의존과 의존 역전
- [테스트 경계](testing-boundaries.md): 레이어별 테스트 책임
- [모듈 간 통신](communication.md): 직접 호출과 이벤트 사용 기준
- [코드 작성 규칙](code-convention.md): 이름, 타입, 책임, 주석

구현 전 이 문서와 작업 대상 도메인 문서를 함께 확인한다.
