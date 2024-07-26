-- AlterTable
ALTER TABLE "user" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "salt" TEXT;
