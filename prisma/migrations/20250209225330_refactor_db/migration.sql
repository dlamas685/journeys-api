/*
  Warnings:

  - You are about to drop the column `latitude` on the `favorite_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `favorite_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `favorite_places` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `favorite_places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "favorite_addresses" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "favorite_places" DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
