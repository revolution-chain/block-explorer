FROM node:20-alpine AS base-stage
ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

COPY --chown=node:node .yarnrc.yml ./
COPY --chown=node:node lerna.json ./
COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node ./packages/api/package.json ./packages/api/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY --chown=node:node ./packages/api/. ./packages/api

FROM base-stage AS development-stage
ENV NODE_ENV=development
COPY --chown=node:node .yarnrc.yml ./
RUN yarn install --frozen-lockfile
RUN yarn cache clean

FROM development-stage AS build-stage
RUN yarn build

FROM base-stage AS production-stage

COPY --chown=node:node --from=build-stage /usr/src/app/packages/api/dist ./packages/api/dist

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG PORT=3000
ENV PORT $PORT

ARG METRICS_PORT=3005
ENV METRICS_PORT $METRICS_PORT

EXPOSE $PORT $METRICS_PORT 9229 9230

USER node
WORKDIR /usr/src/app/packages/api

CMD ["node", "dist/main.js"]
