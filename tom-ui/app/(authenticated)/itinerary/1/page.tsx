"use client";
import { useMemo } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";

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

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });

  return (
    <div className="w-full h-full flex flex-row justify-center items-center">
      <div className="w-1/3 h-full flex flex-col justify-start items-start">
        <p className="text-xs">STEP 1 OF 2</p>
        <h1 className="font-bold text-3xl">Add the places you want to visit</h1>
        <p>
          Use the search bar below to look up and add as many places you want to
          the trip
        </p>
      </div>
      <div className="w-1/3">
        {isLoaded ? (
          <GoogleMap
            options={mapOptions}
            zoom={14}
            center={mapCenter}
            mapTypeId={window.google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: "600px", height: "600px" }}
            onLoad={() => console.log("Map Component Loaded...")}
          />
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}
