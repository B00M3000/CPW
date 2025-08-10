ARG TAG="UNSET"

FROM node:20-alpine AS base

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

WORKDIR /app

COPY pnpm-lock.yaml .
RUN pnpm fetch

FROM base as build

COPY . .
RUN pnpm install -r --offline

ENV PUBLIC_BUILD_NUMBER=${TAG}
COPY .env.production .env

RUN pnpm run build

FROM base as prod-deps

COPY package.json .
RUN pnpm install -r --offline --prod

FROM node:20-alpine

COPY package.json .
COPY --from=prod-deps /app/node_modules /node_modules
COPY --from=build /app/build .

ENV PORT=3000
ENV BODY_SIZE_LIMIT=52428800

EXPOSE 3000/tcp

CMD node -r dotenv/config .
