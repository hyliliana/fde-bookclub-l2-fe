# 독서모임 신청 — Level 2 프론트엔드

상태: 공개배포 · **공개 주소 핵심 사용 경로 검증 완료 / 제출 전**

- 웹앱: [https://fde-bookclub-l2-fe.vercel.app](https://fde-bookclub-l2-fe.vercel.app)
- 백엔드: [https://fde-bookclub-l2-be.onrender.com](https://fde-bookclub-l2-be.onrender.com)
- 공개 소스: [hyliliana/fde-bookclub-l2-fe](https://github.com/hyliliana/fde-bookclub-l2-fe)
- 백엔드 소스: [hyliliana/fde-bookclub-l2-be](https://github.com/hyliliana/fde-bookclub-l2-be)

Next.js로 만든 별도 웹앱입니다. 모임 목록·검색·현황, 상세·신청·취소, 모임 등록을 제공하며 실제 데이터는 Level 2 NestJS 백엔드의 PostgreSQL에 저장합니다. 가짜 데이터 대체는 없습니다.

## 로컬 실행

Node.js 20.9 이상과 pnpm을 사용합니다.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

- 프론트엔드: http://localhost:3001
- 기본 백엔드: http://localhost:4001
- `NEXT_PUBLIC_API_URL`: 실제 Level 2 백엔드 주소. DB 연결 값이나 비밀번호를 넣지 않습니다.

## 화면과 흐름

- `/`: 전체 현황 3개, 모임 검색, 목록
- `/meetings/[id]`: 모임·책·일시·장소 확인, 가상 회원 선택, 신청·취소
- `/meetings/new`: 모임 등록과 입력 안내

신청·취소 성공 시 서버가 돌려준 최신 참가 수와 신청 상태를 바로 반영합니다. 정원 초과·중복 신청은 서버가 거절하며 이유를 화면에 표시합니다. 이미 신청한 가상 회원으로 다시 신청하거나 마감된 모임을 신청하면 거절 동작을 확인할 수 있습니다. 화면에서만 막지 않습니다.

검색 결과와 별도로 상단 현황은 **전체 모임**을 기준으로 합니다. 모든 일정은 한국 시간으로 표시합니다. 등록 화면에서 입력한 한국 시간을 시간대가 포함된 ISO 값으로 변환해 저장합니다.

## 검사

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Vercel 배포

이 프론트엔드는 위 공개 GitHub 저장소의 소스를 ZIP으로 묶어 Vercel **Drop to Deploy**에 올려 배포했습니다. Git 연동 배포가 아니므로 GitHub에 push해도 Vercel이 자동으로 갱신되지 않습니다.

배포용 `.env.production`에는 아래 공개 API 주소만 포함했습니다. DB 주소·비밀번호는 넣지 않습니다.

```text
NEXT_PUBLIC_API_URL=https://fde-bookclub-l2-be.onrender.com
```

소스 변경 후 Vercel에서 별도 재배포가 필요하며 실제 주소를 다시 확인해야 합니다. `NEXT_PUBLIC_` 값은 빌드 시 화면 코드에 포함되므로 주소를 바꿀 때도 재배포가 필요합니다. 설치는 `pnpm install --frozen-lockfile`, 빌드는 `pnpm build`를 사용합니다.

Render 백엔드의 `FRONTEND_URL`은 `https://fde-bookclub-l2-fe.vercel.app`로 설정했습니다. 무료 Render 서버가 대기 중이면 첫 요청에 시간이 걸릴 수 있습니다. 두 앱이 공유하는 Singapore 지역 무료 PostgreSQL의 만료 예정일은 **2026년 11월 28일**입니다.

## 현재 검증 상태

- 로컬 프론트엔드 빌드와 타입 검사를 통과했습니다.
- 로컬 화면과 실제 Render DB를 연결해 신청·취소·정원 및 중복 거절·검색·현황과 모바일 화면을 확인했습니다.
- 공개 배포와 공개 GitHub 저장소 생성·push를 완료했습니다.
- 공식 Playwright MCP로 로그인하지 않은 PC·모바일 환경에서 공개 목록과 상세 화면을 확인했습니다.
- 공개 화면에서 검색, 정원 초과 거절(409), 중복 신청 거절(409), 정상 신청(201) → 취소(200)를 확인하고 검사 전 참가 상태로 복원했습니다.
- 현재 상태는 **공개 주소 핵심 사용 경로 검증 완료 / 제출 전**이며 최종 제출은 제출자가 직접 진행합니다.

기능·화면·데이터 요구사항은 [기획서.md](./기획서.md)를 참고하세요.

## 실습 범위

가상 회원 선택은 로그인이 아닙니다. 실제 개인정보를 입력하지 않는 학습용 앱이며, 가상 데이터 재생성은 백엔드의 전용 명령으로만 수행합니다.
