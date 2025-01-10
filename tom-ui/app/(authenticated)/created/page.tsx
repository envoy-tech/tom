"use client";
import { useMemo, useState } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import RouteCreatedBox from "@/components/ui-components/RouteCreatedBox";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { addLocation } from "@/redux/slices/tripSlice";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";

export default function RoutesCreatedPage() {
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
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
    version: "3.55",
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full mx-20 my-6">
      <div className="w-full flex flex-row justify-start items-center space-x-4">
        <h1 className="text-left font-semibold text-4xl">Routes Created</h1>
        <p className="font-semibold text-center text-sm">
          July 24 - August 1, 2023
        </p>
        <p className="text-sm">8 days</p>
      </div>
      <div className="w-full flex flex-row justify-between items-center mt-6">
        <div className="flex flex-row space-x-3 font-semibold text-advus-gray-500">
          <p className="text-advus-lightblue-500 border-b-2 border-advus-lightblue-500">
            Option 1
          </p>
          <p>Option 2</p>
          <p>Option 3</p>
        </div>
        <p className="flex flex-row items-center font-semibold text-advus-lightblue-500">
          <ArrowUpTrayIcon className="h-6 w-6 mr-3" />
          Share this itinerary
        </p>
      </div>
      <div className="w-full h-full flex flex-row justify-center items-start mt-3 space-x-4">
        <div className="w-1/2 h-full flex flex-col justify-start items-start">
          <div className="h-full w-full flex flex-col border-2 border-gray-400 p-3 rounded-md">
            <div className="overflow-y-scroll space-y-4 pr-3">
              {locations.map((locationData, index) => (
                <div className="flex flex-row" key={`location-${index}`}>
                  <div className="rounded-full bg-advus-brown-500 w-10 h-10 relative flex justify-center items-center p-5 mr-3">
                    <div className="text-white font-semibold">{index + 1}</div>
                  </div>

                  <RouteCreatedBox
                    locationName={locationData.name}
                    locationAddress={locationData.address}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-full w-1/2 flex flex-col items-start justify-start">
          {isLoaded ? (
            <GoogleMap
              options={mapOptions}
              zoom={14}
              center={mapCenter}
              mapTypeId={window.google.maps.MapTypeId.ROADMAP}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                minHeight: "60vh",
                minWidth: "1px",
                flex: "1",
              }}
            />
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
}
