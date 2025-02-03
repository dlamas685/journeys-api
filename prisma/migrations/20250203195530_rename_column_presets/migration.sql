/*
  Warnings:

  - You are about to drop the column `presets` on the `roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `presets` on the `trips` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "roadmaps" DROP COLUMN "presets",
ADD COLUMN     "setting" JSONB,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" DROP COLUMN "presets",
ADD COLUMN     "criteria" JSONB,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
