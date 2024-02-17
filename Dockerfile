FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --production

COPY . .

RUN pnpm build

COPY --from=build /app/dist/ ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start:prod"]
