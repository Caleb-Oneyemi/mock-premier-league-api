# Intial Image
FROM node:16.10.0-alpine AS build

WORKDIR /app

COPY package.json yarn.lock tsconfig.json tsconfig.prod.json ./

RUN yarn install --frozen-lockfile

COPY src ./src

RUN yarn build


# Final Image
FROM node:16.10.0-alpine AS final

WORKDIR /app

EXPOSE 7777

ENV NODE_ENV production

RUN apk add --no-cache tini

COPY config ./config

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production --ignore-platform

COPY --from=build /app/dist ./dist

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/index.js"]
