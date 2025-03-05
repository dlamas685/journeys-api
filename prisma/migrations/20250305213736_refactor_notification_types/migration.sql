/*
  Warnings:

  - The values [OPTIMIZATIONS] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('SYSTEM', 'TRIPS', 'ROADMAPS', 'FLEETS', 'VEHICLES', 'DRIVERS', 'OPTIMIZATION');
ALTER TABLE "notifications" ALTER COLUMN "notification_type" DROP DEFAULT;
ALTER TABLE "notifications" ALTER COLUMN "notification_type" TYPE "NotificationType_new" USING ("notification_type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
ALTER TABLE "notifications" ALTER COLUMN "notification_type" SET DEFAULT 'SYSTEM';
COMMIT;

-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
