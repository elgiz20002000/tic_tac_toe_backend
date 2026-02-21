FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate --schema=src/schema.prisma

EXPOSE 3000

CMD ["node", "--experimental-transform-types", "src/index.ts"]
