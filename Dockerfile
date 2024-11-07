# Этап сборки
FROM node:18.17-alpine AS builder

# Установка необходимых инструментов для сборки и тестов
RUN apk add --no-cache make gcc g++ python3

# Создание рабочей директории
WORKDIR /app

# Копируем файлы package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./
COPY . .

# Устанавливаем зависимости (включая devDependencies для тестирования)
RUN yarn install

# Генерация Prisma клиентских файлов
RUN npx prisma generate

# Запуск тестов на этапе сборки
# RUN yarn test

# Сборка приложения
RUN yarn build

# Этап выполнения
FROM node:18.16-alpine

# Создание рабочей директории
WORKDIR /app

# Копирование необходимых файлов из этапа сборки
COPY --from=builder /app/node_modules/ ./node_modules
COPY --from=builder /app/*.json ./
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/dist/ ./tmp-dist
COPY --from=builder /app/prisma/ ./prisma

# Выполнение миграций и запуск приложения в одном шаге
CMD ["sh", "-c", "npx prisma migrate deploy && node ./dist/src/main.js"]

