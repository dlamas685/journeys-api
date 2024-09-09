-- AlterTable
ALTER TABLE "company_profiles" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "cuit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "personal_profiles" ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL;
