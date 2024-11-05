/*
  Warnings:

  - You are about to drop the column `place_type` on the `favorite_place` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "favorite_place" DROP COLUMN "place_type",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "iconUrl" TEXT,
ADD COLUMN     "types" JSONB;
