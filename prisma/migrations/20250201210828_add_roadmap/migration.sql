-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "code" TEXT NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 10));

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "fleet_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "driver_id" UUID NOT NULL,
    "status" "RoadmapStatus" NOT NULL DEFAULT 'UPCOMING',
    "code" TEXT NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 10)),
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departure_time" TIMESTAMPTZ(6) NOT NULL,
    "arrival_time" TIMESTAMPTZ(6),
    "total_distance" INTEGER,
    "total_duration" INTEGER,
    "presets" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_fleet_id_fkey" FOREIGN KEY ("fleet_id") REFERENCES "fleets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
