/*
  Warnings:

  - Made the column `arrival_time` on table `roadmaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_distance` on table `roadmaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_duration` on table `roadmaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `setting` on table `roadmaps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_distance` on table `trips` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_duration` on table `trips` required. This step will fail if there are existing NULL values in that column.
  - Made the column `criteria` on table `trips` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10)),
ALTER COLUMN "arrival_time" SET NOT NULL,
ALTER COLUMN "total_distance" SET NOT NULL,
ALTER COLUMN "total_distance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_duration" SET NOT NULL,
ALTER COLUMN "setting" SET NOT NULL;

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "total_distance" SET NOT NULL,
ALTER COLUMN "total_distance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_duration" SET NOT NULL,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10)),
ALTER COLUMN "criteria" SET NOT NULL;
