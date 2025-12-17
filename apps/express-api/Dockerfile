FROM node:22-alpine AS base
RUN apk add --no-cache dumb-init && \
    corepack enable && \
    corepack prepare pnpm@8.15.0 --activate
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/express-api/package.json ./apps/express-api/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json
COPY --from=dependencies /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY packages ./packages
COPY apps/express-api ./apps/express-api
RUN pnpm --filter "@student-api/shared-*" run build && \
    pnpm --filter @student-api/express-api run build

FROM base AS deploy
COPY --from=build /app ./
RUN pnpm deploy --filter=@student-api/express-api --prod /prod/express-api && \
    rm -rf /prod/express-api/.pnpm

FROM node:22-alpine AS runtime
RUN apk add --no-cache dumb-init
ENV NODE_ENV=production
WORKDIR /app
USER node
COPY --from=deploy --chown=node:node /prod/express-api ./
EXPOSE 3000
CMD ["dumb-init", "node", "dist/index.js"]
