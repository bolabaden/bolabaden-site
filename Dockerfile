# syntax=docker/dockerfile:1.6
# Use Node.js Alpine as base image
FROM node:alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false || \
    (echo "npm ci failed, trying npm install" && npm install --no-audit --progress=false && npm ci --prefer-offline --no-audit --progress=false)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=cache,target=/app/.next/cache npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG NEXT_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}

ARG PUID=1001
ENV PUID=${PUID}

ARG PGID=1001
ENV PGID=${PGID}

RUN addgroup --system --gid ${PGID} nodejs
RUN adduser --system --uid ${PUID} --ingroup nodejs nextjs
RUN chown -R nextjs:nodejs /app

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

ARG HOSTNAME="0.0.0.0"
ENV HOSTNAME=${HOSTNAME}

CMD ["node", "server.js"] 