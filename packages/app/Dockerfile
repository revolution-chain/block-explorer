FROM node:20-alpine AS base-stage
ENV NODE_ENV=production

WORKDIR /usr/src/app
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Copy configuration and dependency files
# COPY --chown=node:node .yarnrc ./
COPY --chown=node:node lerna.json ./
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node ./packages/app/package.json ./packages/app/

# Install production dependencies only
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Copy app source code
COPY --chown=node:node ./packages/app/. ./packages/app
# RUN rm -f .yarnrc

FROM base-stage AS development-stage
ENV NODE_ENV=development
# COPY --chown=node:node .yarnrc ./
RUN yarn install --frozen-lockfile
RUN yarn cache clean
# RUN rm -f .yarnrc

FROM development-stage AS build-stage
RUN yarn build

FROM base-stage AS production-stage

# Copy build artifacts from build stage
COPY --chown=node:node --from=build-stage /usr/src/app/packages/app/dist ./packages/app/dist

# Install http-server globally
RUN yarn global add http-server

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG PORT=3010
ENV PORT=$PORT

USER node
WORKDIR /usr/src/app/packages/app/dist

CMD ["http-server", "-p", "$PORT", "-c-1", "--proxy", "http://127.0.0.1:$PORT/index.html?"]
