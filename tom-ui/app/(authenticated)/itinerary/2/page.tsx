"use client";
import { useState, useRef, useEffect } from "react";
import { useJsApiLoader, GoogleMap, OverlayView } from "@react-google-maps/api";
import Btn from "@/components/ui-components/Btn";
import LocationNoteBox from "@/components/ui-components/LocationNoteBox";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { useAppSelector } from "@/hooks/redux";
import { getZoom } from "@/utils/google-maps";
import Marker from "@/components/ui-components/Marker";
import { XMarkIcon } from "@heroicons/react/20/solid";

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
  const [zoom, setZoom] = useState(5);
  const [selectedMarker, setSelectedMarker] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
    version: "3.55",
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

      setCenter({
        lat: bounds.getCenter().lat(),
        lng: bounds.getCenter().lng(),
      });
      setZoom(
        getZoom(
          bounds.getSouthWest(),
          bounds.getNorthEast(),
          mapRef.current.getInstance().getDiv().offsetWidth
        ) - 1
      );
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
                zoom={zoom}
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
                    <OverlayView
                      key={`${location.name}-${location.address}`}
                      position={{ lat: location.lat, lng: location.long }}
                      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                      <>
                        <div
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={() => setSelectedMarker(location.address)}
                        >
                          <Marker
                            selected={location.address === selectedMarker}
                          />
                        </div>
                        {location.address === selectedMarker && (
                          <div className="h-fit w-32 shadow-md text-black bg-white rounded-md p-3 ml-5 -mt-5 text-balance break-words relative">
                            <h1 className="font-bold text-md">
                              {location.name}
                            </h1>
                            <p>{location.notes}</p>
                            <XMarkIcon
                              className="h-4 w-4 absolute top-1 right-1 cursor-pointer text-advus-brown-500"
                              onClick={() => setSelectedMarker("")}
                            />
                          </div>
                        )}
                      </>
                    </OverlayView>
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
