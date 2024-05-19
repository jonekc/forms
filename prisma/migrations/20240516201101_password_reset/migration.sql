-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPassword" TEXT,
ADD COLUMN     "resetPasswordExpiresAt" TIMESTAMP(3);
