# ---- build ----
    FROM node:18-bookworm-slim AS builder
    WORKDIR /app

    # ✅ Jenkins에서 build-arg로 넘길 값들 선언
    ARG NEXT_PUBLIC_KAKAO_REST_API_KEY
    ARG NEXT_PUBLIC_KAKAO_REDIRECT_URI
    ARG NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
    ARG NEXT_PUBLIC_API_URL


    # ✅ Next 빌드 시 process.env로 보이도록 ENV 설정
    ENV NEXT_PUBLIC_KAKAO_REST_API_KEY=$NEXT_PUBLIC_KAKAO_REST_API_KEY
    ENV NEXT_PUBLIC_KAKAO_REDIRECT_URI=$NEXT_PUBLIC_KAKAO_REDIRECT_URI
    ENV NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=$NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
    ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL


    COPY package*.json ./
    RUN npm ci --omit=dev=false
    COPY . .
    ENV NEXT_TELEMETRY_DISABLED=1
    RUN npm run build
    
    # ---- run ----
    FROM node:18-bookworm-slim AS runner
    WORKDIR /app
    ARG NEXT_PUBLIC_API_URL
    ENV NODE_ENV=production
    ENV PORT=3000
    ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
    RUN useradd -m nextjs
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    RUN mkdir -p /app/.next/cache && chown -R nextjs:nextjs /app/.next
    RUN chmod -R a+rX /app/public
    USER nextjs
    EXPOSE 3000
    CMD ["node", "server.js"]
    
    
