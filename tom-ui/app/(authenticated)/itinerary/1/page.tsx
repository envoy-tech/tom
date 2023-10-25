"use client";
import { useMemo, useState } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import {
  MagnifyingGlassIcon,
  MapIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";
import Btn from "@/components/ui-components/Btn";
import LocationBox from "@/components/page-components/LocationBox";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { DUMMY_LOCATION_DATA } from "@/utils/dummy-data";

export default function ItineraryPage() {
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
  const [showMapView, setShowMapView] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="w-2/5 mb-20 flex items-center justify-center">
        <MainNavigationSteps currentStep={3} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center">
        <div className="w-1/2 h-full flex flex-col justify-start items-start pl-40 pr-40">
          <p className="text-xs">STEP 1 OF 2</p>
          <h1 className="text-left font-semibold text-3xl mt-2">
            Add the places you want to visit
          </h1>
          <p className="text-left text-s mt-3">
            Use the search bar below to look up and add as many places you want
            to the trip
          </p>
          <div className="w-full mt-6">
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="location"
                name="location"
                id="location"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-navyblue-500 sm:text-sm sm:leading-6"
                placeholder="Search for a location..."
              />
            </div>
          </div>

          <div className="w-full flex flex-col justify-start mt-3">
            <p className="text-xs text-gray-400">SEARCH RESULTS</p>
            <div className="w-full flex flex-col mt-3 border-b-2 bordery-gray-400 pb-3">
              <div className="overflow-y-scroll max-h-96 space-y-5">
                {DUMMY_LOCATION_DATA.map((locationData, index) => (
                  <>
                    <LocationBox
                      locationName={locationData.location}
                      locationAddress={locationData.address}
                      added={index % 2 === 1}
                      key={`location-${index}`}
                    />
                    <div className="border-gray-400 border-b-2 w-11/12"></div>
                  </>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-row justify-between mt-16">
              <Btn buttonType="secondary" type="submit" href="/details/2">
                Back
              </Btn>
              <Btn buttonType="primary" type="submit" href="/travelers">
                Next
              </Btn>
            </div>
          </div>
        </div>
        <div className="h-full w-1/2 flex items-start justify-start pr-40 flex-col">
          <div className="w-full flex flex-row justify-start space-x-3 mb-3 text-xl font-semibold">
            <div
              className={`flex flex-col justify-center items-center hover:cursor-pointer select-none ${
                showMapView ? "text-advus-lightblue-500" : "text-gray-800"
              }`}
              onClick={(e) => setShowMapView(true)}
            >
              <div className="flex flex-row justify-center items-center">
                <MapIcon className="h-5 w-5 mr-1" />
                Map View
              </div>

              {showMapView && (
                <div className="border-advus-lightblue-500 border-b-2 w-full"></div>
              )}
            </div>
            <div
              className={`flex flex-col justify-center items-center hover:cursor-pointer select-none ${
                showMapView ? "text-gray-800" : "text-advus-lightblue-500"
              }`}
              onClick={(e) => setShowMapView(false)}
            >
              <div className="flex flex-row justify-center items-center">
                <ListBulletIcon className="h-5 w-5 mr-1" /> List View
              </div>

              {!showMapView && (
                <div className="border-advus-lightblue-500 border-b-2 w-full"></div>
              )}
            </div>
          </div>
          {showMapView ? (
            isLoaded ? (
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
            )
          ) : (
            <div className="border-gray-400 border-2 w-full h-full"></div>
          )}
        </div>
      </div>
    </div>
  );
}
