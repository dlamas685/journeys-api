-- AlterTable
ALTER TABLE "company_profiles" ADD COLUMN     "entity_type" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_type" DROP NOT NULL,
ALTER COLUMN "user_type" DROP DEFAULT;
