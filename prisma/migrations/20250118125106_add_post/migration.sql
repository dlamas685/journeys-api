-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('AVAILABLE', 'FULL', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "post_status" "PostStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "destination" TEXT NOT NULL,
    "city_town" TEXT NOT NULL,
    "carrier_name" TEXT,
    "carrier_phone" TEXT,
    "price_per_kg" DECIMAL(65,30),
    "price_per_postal" DECIMAL(65,30),
    "max_capacity_kg" DOUBLE PRECISION,
    "current_filling_kg" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
