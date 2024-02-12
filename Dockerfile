FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json ./

RUN pnpm install --production

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start:prod"]
