FROM node:18.17.1-alpine AS base-stage
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install system dependencies
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Copy dependency manifests
COPY --chown=node:node .yarnrc ./
COPY --chown=node:node lerna.json ./
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node ./packages/data-fetcher/package.json ./packages/data-fetcher/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy app source
COPY --chown=node:node ./packages/data-fetcher/. ./packages/data-fetcher
RUN rm -f .yarnrc

# ----------------------------
# Development stage
# ----------------------------
FROM base-stage AS development-stage
ENV NODE_ENV=development
COPY --chown=node:node .yarnrc ./
RUN yarn install --frozen-lockfile
RUN yarn cache clean
RUN rm -f .yarnrc

# ----------------------------
# Build stage
# ----------------------------
FROM development-stage AS build-stage
RUN yarn build

# ----------------------------
# Production stage
# ----------------------------
FROM base-stage AS production-stage

# Optional healthcheck (commented out)
# HEALTHCHECK --interval=30s --timeout=3s --retries=5 \
#   CMD curl -f http://localhost:${PORT}/health || exit 1

# Copy build output
COPY --chown=node:node --from=build-stage /usr/src/app/packages/data-fetcher/dist ./packages/data-fetcher/dist

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3040
ENV PORT=$PORT

EXPOSE $PORT 9229 9230

USER node
WORKDIR /usr/src/app/packages/data-fetcher

CMD ["node", "dist/main.js"]
