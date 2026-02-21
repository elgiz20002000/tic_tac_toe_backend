FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema=src/schema.prisma

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node", "--experimental-transform-types", "src/index.ts"]
