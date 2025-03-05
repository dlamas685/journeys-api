/*
  Warnings:

  - The values [CANCELLED] on the enum `RoadmapStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoadmapStatus_new" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'DISMISSED');
ALTER TABLE "roadmaps" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "roadmaps" ALTER COLUMN "status" TYPE "RoadmapStatus_new" USING ("status"::text::"RoadmapStatus_new");
ALTER TYPE "RoadmapStatus" RENAME TO "RoadmapStatus_old";
ALTER TYPE "RoadmapStatus_new" RENAME TO "RoadmapStatus";
DROP TYPE "RoadmapStatus_old";
ALTER TABLE "roadmaps" ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
COMMIT;

-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
