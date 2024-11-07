<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Описание

Microservice for authentication and authorization.

## Установка

```
# Установка пакетов
yarn install

# Выполнение миграций
yarn prisma migrate deploy

# Выполнение сидеров
yarn prisma db seed

# Копирование шаблона для env настроек проекта 
cp .env.example .env
```

### Управление Prisma ORM

```
# Создание миграции
yarn prisma migrate dev --name init

# Обновление Prisma Client по схеме  
yarn prisma generate

# Обновление базы данных по файлам миграции в режиме разработки
yarn prisma migrate dev

# Устранение проблем с миграциями базы данных
yarn prisma migrate resolve

# Обновление базы данных по неисполненным миграциям в прод. режиме
yarn prisma migrate deploy

# Запуск сидов, заполняющих таблицы тестовыми данными
yarn prisma db seed
```

### Запуск приложения

```
# В режиме разработки
yarn start:dev

# В продакшн режиме
yarn start:prod
```

### О проекте

API для CRM ОРД системы, созданный в рамках SocialJet компании

### Авторы

- Author - [ASt](https://github.com/ast39)
- Telegram - [@ASt39](https://t.me/ASt39)

### Лицензия
ASt

### Модуль дампов БД

---
**#### Структура:

- dumps
- - pgsql
- - - 2024-04-21T11:00:00_sso_service_pgsql.sql
- - - ...
- - - 2024-04-23T11:00:00_sso_service_pgsql.sql
- .env
- db_dumper.sh

---
#### Файл .env
```dotenv
### Container
API_CONTAINER=sso_service_api
POSTGRES_CONTAINER=sso_service_pgsql
POSTGRES_DUMP_PATH=dumps/pgsql


### Database
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=postgres
```

---
#### Настроить права на файловую систему
```bash
# Восстановить структуру каталогов
mkdir dumps
cd dumps
mkdir pgsql
 
# права на выполнение скрипта
chmod +x db_dumper.sh

# права на выполнение скрипта восстановления
chmod +x db_recoverer.sh

# права на сохранение дампов
chmod +w -R dumps/pgsql
```

---
Команды
```bash
# Запуск докера
docker-compose up -d

# Создание дампа
./db_dumper.sh

# Восстановление из дампа
./db_recoverer.sh {DUMP_NAME}

# Пример восстановления:
./db_recoverer.sh 2024-04-23T13-52-14_pmp_postgres.sql
```

---
Ролевая система
```bash
# Доступ только по JWT токену 
# Вешается как на метод, так и на весь контроллер
@UseGuards(JwtAuthGuard)

# Доступ только рутовой учетке
# Вешается как на метод, так и на весь контроллер
@UseGuards(IsRootGuard)

# Доступ только учетке с указанными правами (одними из указанных)
# Вешается как на метод, так и на весь контроллер
@Roles('finance,hr')
```
---