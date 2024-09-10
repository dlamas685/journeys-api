/*
  Warnings:

  - You are about to drop the column `entity_type` on the `company_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company_profiles" DROP COLUMN "entity_type",
ADD COLUMN     "manager" TEXT,
ADD COLUMN     "manager_email" TEXT,
ADD COLUMN     "manager_phone" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tax_address" TEXT;
