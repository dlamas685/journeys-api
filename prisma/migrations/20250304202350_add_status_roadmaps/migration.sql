/*
  Warnings:

  - You are about to drop the column `is_archived` on the `roadmaps` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "roadmaps" DROP COLUMN "is_archived",
ADD COLUMN     "status" "RoadmapStatus" NOT NULL DEFAULT 'UPCOMING',
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
