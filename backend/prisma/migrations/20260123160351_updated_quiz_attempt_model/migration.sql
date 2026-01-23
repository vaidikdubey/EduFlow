/*
  Warnings:

  - The `answers` column on the `QuizAttempt` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB[];
