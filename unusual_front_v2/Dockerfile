# 1. Используем официальный образ Node.js
FROM node:22-slim AS builder

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json (если есть)
COPY package.json package-lock.json ./

# 4. Устанавливаем зависимости (используем кеширование)
RUN npm ci --legacy-peer-deps

# 5. Копируем весь проект
COPY . .

# 6. Собираем Next.js приложение
RUN npm run build

# 7. Оптимизированный образ для продакшена
FROM node:22-slim

# 8. Устанавливаем рабочую директорию
WORKDIR /app

# 9. Копируем только нужные файлы из builder-контейнера
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

# 10. Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# 11. Запускаем сервер Next.js
CMD ["npm", "run", "start"]