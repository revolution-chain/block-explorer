FROM node:20-alpine AS base-stage
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install required build tools
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Copy dependency files
# COPY --chown=node:node .yarnrc ./
COPY --chown=node:node lerna.json ./
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node ./packages/worker/package.json ./packages/worker/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy source files
COPY --chown=node:node ./packages/worker/. ./packages/worker
# RUN rm -f .yarnrc

# Development stage
FROM base-stage AS development-stage
ENV NODE_ENV=development
# COPY --chown=node:node .yarnrc ./
RUN yarn install --frozen-lockfile
RUN yarn cache clean
# RUN rm -f .yarnrc

# Build stage
FROM development-stage AS build-stage
RUN yarn build

# Production stage
FROM base-stage AS production-stage

# Copy built artifacts
COPY --chown=node:node --from=build-stage /usr/src/app/packages/worker/dist ./packages/worker/dist

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3001
ENV PORT=$PORT

EXPOSE $PORT 9229 9230

USER node
WORKDIR /usr/src/app/packages/worker

CMD ["node", "dist/main.js"]
