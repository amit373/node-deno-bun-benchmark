FROM node:22-alpine AS base
RUN corepack enable && \
    corepack prepare pnpm@8.15.0 --activate
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/bun-api/package.json ./apps/bun-api/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY packages ./packages
COPY apps/bun-api ./apps/bun-api
RUN pnpm --filter "@student-api/shared-*" run build && \
    pnpm --filter @student-api/bun-api run build

FROM base AS deploy
COPY --from=build /app ./
RUN pnpm deploy --filter=@student-api/bun-api --prod /prod/bun-api && \
    rm -rf /prod/bun-api/.pnpm

FROM oven/bun:1.2-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
USER bun
COPY --from=deploy --chown=bun:bun /prod/bun-api ./
EXPOSE 3001
CMD ["bun", "run", "dist/index.js"]
