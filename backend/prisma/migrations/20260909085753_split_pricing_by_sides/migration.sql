/*
  Warnings:

  - You are about to drop the column `bwPrice` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `colorPrice` on the `Shop` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "bwPrice",
DROP COLUMN "colorPrice",
ADD COLUMN     "bwDoublePrice" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
ADD COLUMN     "bwSinglePrice" DOUBLE PRECISION NOT NULL DEFAULT 2,
ADD COLUMN     "colorDoublePrice" DOUBLE PRECISION NOT NULL DEFAULT 8,
ADD COLUMN     "colorSinglePrice" DOUBLE PRECISION NOT NULL DEFAULT 10;
