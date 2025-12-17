FROM denoland/deno:2.0.0 AS base

WORKDIR /app

FROM base AS cache
COPY packages ./packages
COPY apps/deno-api/deno.json apps/deno-api/src ./apps/deno-api/
WORKDIR /app/apps/deno-api
RUN rm -f deno.lock && \
    deno cache --reload --allow-scripts --unstable-sloppy-imports src/index.ts

FROM base AS runtime
ENV DENO_ENV=production
WORKDIR /app
COPY --from=cache /app/packages ./packages
COPY --from=cache /app/apps/deno-api ./apps/deno-api
COPY --from=cache /root/.cache/deno /root/.cache/deno
WORKDIR /app/apps/deno-api
USER deno
EXPOSE 3002
CMD ["deno", "run", "--unstable-sloppy-imports", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "src/index.ts"]
