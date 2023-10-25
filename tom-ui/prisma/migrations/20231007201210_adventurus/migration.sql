/*
  Warnings:

  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileTrip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileTrip" DROP CONSTRAINT "ProfileTrip_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "ProfileTrip" DROP CONSTRAINT "ProfileTrip_trip_id_fkey";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "ProfileTrip";

-- DropTable
DROP TABLE "Trip";

-- CreateTable
CREATE TABLE "profile" (
    "profile_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ethnicity" TEXT,
    "income" TEXT,
    "preferred_season" TEXT,
    "friends" INTEGER[],

    CONSTRAINT "profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "profile_trip" (
    "profile_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "is_ready_to_optimize" BOOLEAN NOT NULL,
    "trip_preferences_json" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "trip" (
    "trip_id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "start_date_dttm" TIMESTAMP(3) NOT NULL,
    "end_date_dttm" TIMESTAMP(3) NOT NULL,
    "dates_approximate" BOOLEAN NOT NULL,
    "start_location_idx" TEXT NOT NULL,
    "end_location_idx" TEXT NOT NULL,
    "locations_json" JSONB NOT NULL,
    "itineraries_json_array" JSONB[],

    CONSTRAINT "trip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profile_trip_profile_id_trip_id_key" ON "profile_trip"("profile_id", "trip_id");

-- AddForeignKey
ALTER TABLE "profile_trip" ADD CONSTRAINT "profile_trip_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_trip" ADD CONSTRAINT "profile_trip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;
