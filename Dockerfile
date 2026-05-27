# syntax=docker/dockerfile:1.7

# ───────────────────────── Dependencies ─────────────────────────
FROM asafandigal.jfrog.io/docker/node:20-alpine AS deps
WORKDIR /app

# Copy lockfile separately so the npm ci layer is cached when source changes.
COPY package.json package-lock.json ./
RUN npm ci

# ───────────────────────── Build ────────────────────────────────
FROM asafandigal.jfrog.io/docker/node:20-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_COMMIT_SHA=local
ENV NEXT_PUBLIC_COMMIT_SHA=${NEXT_PUBLIC_COMMIT_SHA}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# `output: 'standalone'` in next.config.ts emits a self-contained server
# to .next/standalone, with .next/static and public/ copied alongside.
RUN npm run build

# ───────────────────────── Runtime ──────────────────────────────
FROM asafandigal.jfrog.io/docker/node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Drop privileges to the non-root `node` user already present in the image.
RUN chown -R node:node /app
USER node

COPY --chown=node:node --from=build /app/public ./public
COPY --chown=node:node --from=build /app/.next/standalone ./
COPY --chown=node:node --from=build /app/.next/static ./.next/static

EXPOSE 3000

# server.js is the entrypoint that `output: 'standalone'` produces.
CMD ["node", "server.js"]
