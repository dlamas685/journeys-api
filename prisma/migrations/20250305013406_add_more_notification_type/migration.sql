-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'ROADMAPS';
ALTER TYPE "NotificationType" ADD VALUE 'FLEETS';
ALTER TYPE "NotificationType" ADD VALUE 'VEHICLES';
ALTER TYPE "NotificationType" ADD VALUE 'DRIVERS';

-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
