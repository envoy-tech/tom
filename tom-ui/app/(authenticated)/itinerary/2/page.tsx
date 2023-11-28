"use client";
import { useMemo, useState } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import Btn from "@/components/ui-components/Btn";
import LocationNoteBox from "@/components/ui-components/LocationNoteBox";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { DUMMY_LOCATION_DATA } from "@/utils/dummy-data";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { addLocation } from "@/redux/slices/tripSlice";

export default function ItineraryPageStepTwo() {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );
  const locations = useAppSelector((state) => state.trip.locations);
  const dispatch = useAppDispatch();

  if (locations.length === 0) {
    DUMMY_LOCATION_DATA.map((location) => dispatch(addLocation(location)));
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-2/5 mb-20 flex items-center justify-center mt-36">
        <MainNavigationSteps currentStep={3} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center mt-6">
        <div className="w-1/2 h-full flex flex-col justify-start items-start pl-40 pr-40">
          <p className="text-xs">STEP 2 OF 2</p>
          <h1 className="text-left font-semibold text-3xl mt-2">
            Add notes to the locations you've added
          </h1>
          <p className="text-left text-s mt-3">
            Select one of the locations you've added to write down any details
            you want to keep track of and/or share with your fellow travelers.
          </p>
          <div className="w-full flex flex-col justify-start mt-3">
            <div className="w-full flex flex-col mt-3 border-b-2 bordery-gray-400 pb-3">
              <div className="overflow-y-scroll max-h-96 space-y-4 pr-3">
                {DUMMY_LOCATION_DATA.map((locationData, index) => (
                  <div className="space-y-3" key={`location-${index}`}>
                    <LocationNoteBox
                      locationName={locationData.name}
                      locationAddress={locationData.address}
                    />
                    {index !== DUMMY_LOCATION_DATA.length - 1 && (
                      <div className="border-gray-400 border-b-2 w-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-row justify-between mt-16">
              <Btn buttonType="secondary" type="submit" href="/itinerary/1">
                Back
              </Btn>
              <Btn buttonType="primary" type="submit" href="/finalize">
                Next
              </Btn>
            </div>
          </div>
        </div>
        <div className="h-full w-1/2 flex items-start justify-start pr-40 flex-col">
          <div className="w-full h-full">
            {isLoaded ? (
              <GoogleMap
                options={mapOptions}
                zoom={14}
                center={mapCenter}
                mapTypeId={window.google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{
                  minWidth: "550px",
                  minHeight: "750px",
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
