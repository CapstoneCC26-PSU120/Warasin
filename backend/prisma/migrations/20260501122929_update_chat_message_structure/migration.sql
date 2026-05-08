-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "answer" TEXT,
ADD COLUMN     "field" TEXT,
ADD COLUMN     "question" TEXT,
ADD COLUMN     "value" DOUBLE PRECISION;
