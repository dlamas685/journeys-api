-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "trip_status" "TripStatus" NOT NULL DEFAULT 'UPCOMING',
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departure_time" TIMESTAMPTZ(6) NOT NULL,
    "arrival_time" TIMESTAMPTZ(6) NOT NULL,
    "distance" DOUBLE PRECISION,
    "duration" INTEGER,
    "presets" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
