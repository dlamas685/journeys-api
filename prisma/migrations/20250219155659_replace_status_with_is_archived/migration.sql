/*
  Warnings:

  - You are about to drop the column `status` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `trip_status` on the `trips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roadmaps" DROP COLUMN "status",
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "trip_status",
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- DropEnum
DROP TYPE "RoadmapStatus";

-- DropEnum
DROP TYPE "TripStatus";
