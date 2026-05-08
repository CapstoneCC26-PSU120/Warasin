/*
  Warnings:

  - You are about to drop the `ChatSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ChatSession";

-- CreateTable
CREATE TABLE "chat_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION,
    "category" TEXT,
    "advice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
