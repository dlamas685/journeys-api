/*
  Warnings:

  - You are about to drop the column `distance` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `trips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "distance",
DROP COLUMN "duration",
ADD COLUMN     "total_distance" INTEGER,
ADD COLUMN     "total_duration" INTEGER;
