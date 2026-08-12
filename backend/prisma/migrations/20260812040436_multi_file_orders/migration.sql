/*
  Warnings:

  - You are about to drop the column `colorMode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `copies` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `fileKey` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "colorMode",
DROP COLUMN "copies",
DROP COLUMN "fileKey",
DROP COLUMN "originalName",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "OrderFile" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "copies" INTEGER NOT NULL DEFAULT 1,
    "colorMode" TEXT NOT NULL DEFAULT 'BW',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderFile" ADD CONSTRAINT "OrderFile_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
