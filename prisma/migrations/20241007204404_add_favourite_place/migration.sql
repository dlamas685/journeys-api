-- AlterTable
ALTER TABLE "favorite_address" RENAME COLUMN "placeId" TO "place_id";

-- CreateTable
CREATE TABLE "favorite_place" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "place_id" TEXT,
    "place_type" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "favorite_place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_place_user_id_place_id_key" ON "favorite_place"("user_id", "place_id");

-- AddForeignKey
ALTER TABLE "favorite_place" ADD CONSTRAINT "favorite_place_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
