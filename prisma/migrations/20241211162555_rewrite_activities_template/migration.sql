/*
  Warnings:

  - You are about to drop the `activity_templates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activity_templates" DROP CONSTRAINT "activity_templates_user_id_fkey";

-- DropTable
DROP TABLE "activity_templates";

-- CreateTable
CREATE TABLE "activities_templates" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activities" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "activities_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activities_templates_user_id_name_key" ON "activities_templates"("user_id", "name");

-- AddForeignKey
ALTER TABLE "activities_templates" ADD CONSTRAINT "activities_templates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
