FROM node:18-alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci --prod

COPY ./build .

CMD ["node ", "-r dotenv/config", "."]

ENV PORT=80
ENV BODY_SIZE_LIMIT=52428800

EXPOSE 80/tcp
