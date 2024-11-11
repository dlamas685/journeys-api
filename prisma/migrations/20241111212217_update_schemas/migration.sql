/*
  Warnings:

  - You are about to drop the `activity_template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_place` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_template" DROP CONSTRAINT "activity_template_user_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_address" DROP CONSTRAINT "favorite_address_user_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_place" DROP CONSTRAINT "favorite_place_user_id_fkey";

-- DropTable
DROP TABLE "activity_template";

-- DropTable
DROP TABLE "favorite_address";

-- DropTable
DROP TABLE "favorite_place";

-- CreateTable
CREATE TABLE "favorite_addresses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "alias" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "favorite_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_places" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "place_id" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "favorite_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_templates" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "activities" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "activity_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_addresses_user_id_alias_key" ON "favorite_addresses"("user_id", "alias");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_places_user_id_place_id_key" ON "favorite_places"("user_id", "place_id");

-- CreateIndex
CREATE UNIQUE INDEX "activity_templates_user_id_name_key" ON "activity_templates"("user_id", "name");

-- AddForeignKey
ALTER TABLE "favorite_addresses" ADD CONSTRAINT "favorite_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_places" ADD CONSTRAINT "favorite_places_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_templates" ADD CONSTRAINT "activity_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
