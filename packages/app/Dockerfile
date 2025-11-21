# ==============================================================
# 1. Base – production deps only
# ==============================================================
FROM node:20-alpine AS base-stage
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Some native packages need build tools
RUN apk add --no-cache python3 make g++ && rm -rf /var/cache/apk/*

# Root files
COPY lerna.json package.json yarn.lock ./

# Copy only package.json files so Yarn can hoist correctly
COPY packages/app/package.json ./packages/app/

# Install only production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean

# Now copy the actual source code (folder already exists → no error)
COPY ./packages/app/. ./packages/app


# ==============================================================
# 2. Development – full deps for build
# ==============================================================
FROM base-stage AS development-stage
ENV NODE_ENV=development
RUN yarn install --frozen-lockfile && yarn cache clean


# ==============================================================
# 3. Build the Vue app
# ==============================================================
FROM development-stage AS build-stage
WORKDIR /usr/src/app/packages/app
RUN yarn build
# → creates /usr/src/app/packages/app/dist


# ==============================================================
# 4. Final image – nginx serving static files
# ==============================================================
FROM nginx:stable-alpine AS production-stage

# Copy built assets
COPY --from=build-stage /usr/src/app/packages/app/dist /usr/share/nginx/html

# SPA-friendly nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 3010

CMD ["nginx", "-g", "daemon off;"]