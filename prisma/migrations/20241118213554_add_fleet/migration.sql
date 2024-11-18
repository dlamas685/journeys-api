-- CreateTable
CREATE TABLE "fleets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_vehicles" SMALLINT,
    "max_drivers" SMALLINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "fleets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fleets_user_id_name_key" ON "fleets"("user_id", "name");

-- AddForeignKey
ALTER TABLE "fleets" ADD CONSTRAINT "fleets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
