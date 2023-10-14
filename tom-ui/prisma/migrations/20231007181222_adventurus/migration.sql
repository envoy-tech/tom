-- CreateTable
CREATE TABLE "Profile" (
    "profile_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ethnicity" TEXT,
    "income" TEXT,
    "preferred_season" TEXT,
    "friends" INTEGER[],

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "ProfileTrip" (
    "profile_id" INTEGER NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "is_ready_to_optimize" BOOLEAN NOT NULL,
    "trip_preferences_json" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "Trip" (
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

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("trip_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTrip_profile_id_trip_id_key" ON "ProfileTrip"("profile_id", "trip_id");

-- AddForeignKey
ALTER TABLE "ProfileTrip" ADD CONSTRAINT "ProfileTrip_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("profile_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileTrip" ADD CONSTRAINT "ProfileTrip_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;
