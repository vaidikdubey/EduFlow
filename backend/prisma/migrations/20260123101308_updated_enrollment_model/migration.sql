-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" TEXT;
