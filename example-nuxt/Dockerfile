FROM node:20-alpine AS build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY src /app/src
COPY example-nuxt /app/example-nuxt

WORKDIR /app/example-nuxt

RUN npm install
RUN npm run build

FROM node:20-alpine AS runtime

ENV HOST=0.0.0.0
ENV PORT=3009
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3009

WORKDIR /app/example-nuxt

COPY --from=build /app/example-nuxt/.output /app/example-nuxt/.output
COPY --from=build /app/example-nuxt/package.json /app/example-nuxt/package.json

EXPOSE 3009

CMD ["node", ".output/server/index.mjs"]
