-- AlterTable
ALTER TABLE "roadmaps" ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));

-- AlterTable
ALTER TABLE "trips" ALTER COLUMN "arrival_time" DROP NOT NULL,
ALTER COLUMN "total_distance" DROP NOT NULL,
ALTER COLUMN "total_duration" DROP NOT NULL,
ALTER COLUMN "code" SET DEFAULT upper(substr(md5(random()::text), 1, 10));
