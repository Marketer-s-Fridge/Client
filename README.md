# Marketer's Fridge Frontend

Marketer's Fridge는 마케터를 위한 카드뉴스 아카이브 서비스입니다.
이 저장소는 웹 프론트엔드 코드베이스이며, Next.js(App Router) 기반으로 개발되었습니다.

## 주요 기술 스택
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query – 클라이언트 캐시/동기화
- Axios – 백엔드 REST API 통신
- Framer Motion / Swiper / Keen Slider – 인터랙션 및 모션 UI

## 렌더링 전략
- SSR/SSG/ISR 혼합 구성
- 홈/검색/카테고리/상세 페이지는 서버 데이터 프리패치 + ISR
- 상세 페이지는 `generateMetadata`, `loading.tsx`, `error.tsx` 적용

## 주요 기능
- 카드뉴스 목록/상세 조회
- HOT 콘텐츠 / Editor Pick 큐레이션
- 검색/카테고리 필터/정렬/페이징
- 로그인/회원가입 및 소셜 로그인(카카오)
- 마이페이지, 문의/피드백/뷰 카운트 기록

## 실행 환경
- Node.js >= 18 권장

## 환경 변수
- `NEXT_PUBLIC_API_URL` = `https://marketersfridge.co.kr`
- `NEXT_PUBLIC_KAKAO_REST_API_KEY`
- `NEXT_PUBLIC_KAKAO_REDIRECT_URI`
- `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`

로컬 실행 시 `.env.local`에 설정합니다.

## 실행 방법
```bash
npm install

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build
npm run start
```

## 폴더 구조 (요약)
- `src/app` : App Router 페이지
- `src/components` : 공통 UI 컴포넌트
- `src/features` : 도메인별 기능 (auth, posts, enquiries 등)
- `src/lib` : 공용 유틸/서버 API

## 배포
- Docker + Jenkins + Nginx 구성
- 빌드 시 `NEXT_PUBLIC_*` 환경변수 주입 필요
