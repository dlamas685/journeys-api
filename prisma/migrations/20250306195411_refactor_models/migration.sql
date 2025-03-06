/*
  Warnings:

  - You are about to drop the column `arrival_time` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `departure_time` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `total_distance` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `total_duration` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `arrival_time` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `departure_time` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `destination` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `total_distance` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `total_duration` on the `trips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roadmaps" DROP COLUMN "arrival_time",
DROP COLUMN "departure_time",
DROP COLUMN "destination",
DROP COLUMN "origin",
DROP COLUMN "total_distance",
DROP COLUMN "total_duration",
ADD COLUMN     "results" JSONB,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "arrival_time",
DROP COLUMN "departure_time",
DROP COLUMN "destination",
DROP COLUMN "origin",
DROP COLUMN "total_distance",
DROP COLUMN "total_duration",
ADD COLUMN     "results" JSONB,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
