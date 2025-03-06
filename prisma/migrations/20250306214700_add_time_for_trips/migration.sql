/*
  Warnings:

  - Added the required column `departure_time` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "departure_time" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
