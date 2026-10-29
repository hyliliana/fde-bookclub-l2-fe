# 독서모임 신청 — Level 2 프론트엔드

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

1. 이 폴더만 Level 2 프론트엔드 저장소에 넣습니다. 기획서.md와 잠금 파일도 포함합니다.
2. Vercel에서 저장소를 가져오고 Next.js를 선택합니다.
3. `NEXT_PUBLIC_API_URL`을 실제 Level 2 Render 백엔드 HTTPS 주소로 설정합니다.
4. 설치 명령은 `pnpm install --frozen-lockfile`, 빌드 명령은 `pnpm build`입니다.
5. 백엔드 `FRONTEND_URL`에 실제 Vercel 출처를 허용합니다.
6. 공개 주소에서 정상 신청·취소·정원 초과·중복 거절, 검색·현황, 등록을 다시 확인합니다.

`NEXT_PUBLIC_` 변수는 빌드 시 포함되므로 수정한 뒤 다시 배포해야 합니다. README는 배포 방법이며 실제 배포와 DB 검증 완료를 의미하지 않습니다.

## 실습 범위

가상 회원 선택은 로그인이 아닙니다. 실제 개인정보를 입력하지 않는 학습용 앱이며, 가상 데이터 재생성은 백엔드의 전용 명령으로만 수행합니다.
