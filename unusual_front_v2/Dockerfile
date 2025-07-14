# 1. Стадия сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходники и собираем проект
COPY . .
RUN npm run build

# 2. Production stage с minimal Node runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Только необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Запуск Next.js сервера
EXPOSE 3000
CMD ["npm", "start"]
