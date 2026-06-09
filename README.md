# Task Management API

Система управления задачами с аутентификацией и авторизацией (USER/ADMIN). Реализовано на NestJS с использованием PostgreSQL, Prisma ORM и JWT.

## Установка и запуск
```bash
npm install
```
Создайте файл .env в корне проекта:
```
DATABASE_URL="postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/task_management?schema=public"
JWT_SECRET="секретный_ключ_для_jwt"
JWT_EXPIRES_IN="1d"
PORT=3000
```
В "C:\Program Files\PostgreSQL\18\bin\psql":
```bash
-U postgres
```
```bash
CREATE DATABASE task_management;
```
В корне проекта:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev
```