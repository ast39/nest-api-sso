/*
  Warnings:

  - A unique constraint covering the columns `[telegram_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "telegram_name" VARCHAR(255);

-- CreateTable
CREATE TABLE "tg_auth" (
    "id" SERIAL NOT NULL,
    "auth_key" VARCHAR(128),
    "chat_id" VARCHAR(128),

    CONSTRAINT "tg_auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tg_auth_auth_key_key" ON "tg_auth"("auth_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_telegram_id_key" ON "users"("telegram_id");
