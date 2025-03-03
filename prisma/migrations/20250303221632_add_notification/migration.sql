-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'TRIPS', 'OPTIMIZATIONS');

-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "notification_type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "subject" TEXT NOT NULL,
    "message" TEXT,
    "read_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
