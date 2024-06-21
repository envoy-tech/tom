"use client";
import { useState, useRef, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  InfoBox,
} from "@react-google-maps/api";
import Btn from "@/components/ui-components/Btn";
import LocationNoteBox from "@/components/ui-components/LocationNoteBox";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { useAppSelector } from "@/hooks/redux";

const libraries = ["places"];
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
};
const mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 };

export default function ItineraryPageStepTwo() {
  const locations = useAppSelector((state) => state.trip.locations);
  const mapRef = useRef(null);
  const [center, setCenter] = useState(mapCenter);
  const [selectedMarker, setSelectedMarker] = useState<string>("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current && locations.length) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.map((location) =>
        bounds.extend(
          new window.google.maps.LatLng({
            lat: location.lat,
            lng: location.long,
          })
        )
      );

      setCenter(bounds.getCenter());
    }
  }, [isLoaded]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 py-12">
      <div className="w-2/5 mb-20 flex items-center justify-center mt-6">
        <MainNavigationSteps currentStep={3} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center mt-6 space-x-10">
        <div className="w-full h-full flex flex-col justify-start items-start">
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
              <div className="overflow-y-scroll h-96 space-y-4 pr-3">
                {locations.map((locationData, index) => (
                  <div className="space-y-3" key={`location-${index}`}>
                    <LocationNoteBox
                      locationName={locationData.name}
                      locationAddress={locationData.address}
                      setSelectedMarker={setSelectedMarker}
                    />
                    {index !== locations.length - 1 && (
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
        <div className="h-full w-full flex items-start justify-start flex-col">
          <div className="w-full h-full">
            {isLoaded ? (
              <GoogleMap
                options={mapOptions}
                zoom={5}
                center={center}
                mapTypeId={window.google.maps.MapTypeId.ROADMAP}
                mapContainerStyle={{
                  minHeight: "650px",
                  width: "100%",
                  height: "100%",
                }}
                ref={mapRef}
              >
                {locations.length &&
                  locations.map((location) => (
                    <Marker
                      key={`${location.name}-${location.address}`}
                      position={{ lat: location.lat, lng: location.long }}
                      onClick={() => setSelectedMarker(location.address)}
                    >
                      {location.address === selectedMarker && (
                        <InfoBox
                          options={{
                            pixelOffset: new window.google.maps.Size(20, -40),
                            closeBoxMargin: "10px 10px 2px 2px",
                            infoBoxClearance: new google.maps.Size(1, 1),
                            closeBoxURL: "",
                          }}
                        >
                          <div className="h-fit w-32 shadow-md text-black bg-white rounded-md p-3 text-balance break-words">
                            <h1 className="font-bold text-md">
                              {location.name}
                            </h1>
                            <p>{location.notes}</p>
                          </div>
                        </InfoBox>
                      )}
                    </Marker>
                  ))}
              </GoogleMap>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
