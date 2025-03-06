/*
  Warnings:

  - Added the required column `end_date_time` to the `roadmaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date_time` to the `roadmaps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roadmaps" ADD COLUMN     "end_date_time" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "start_date_time" TIMESTAMPTZ(6) NOT NULL,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
