"use client";
import { useState, useEffect, useRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import RouteCreatedBox from "@/components/ui-components/RouteCreatedBox";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { getZoom } from "@/utils/google-maps";
import Marker from "@/components/ui-components/Marker";
import { minToDays } from "@/utils/time";

const libraries = ["places"];
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
};
const mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 };

export default function RoutesCreatedPage() {
  const mapRef = useRef(null);
  const [center, setCenter] = useState(mapCenter);
  const [zoom, setZoom] = useState(5);
  const [selectedMarker, setSelectedMarker] = useState("");
  const { locations, startDate, endDate } = useAppSelector(
    (state) => state.trip
  );
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
    version: "3.55",
  });
  const totalUsedTime = locations.reduce(
    (acc, curr) =>
      curr.timeAllocated !== undefined ? acc + curr.timeAllocated : acc + 0,
    0
  );

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
      // setZoom(
      //   getZoom(
      //     bounds.getSouthWest(),
      //     bounds.getNorthEast(),
      //     mapRef.current.getInstance().getDiv().offsetWidth
      //   ) - 1
      // );
    }
  }, [isLoaded]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center w-full h-full mx-20 my-6">
      <div className="w-full flex flex-row justify-start items-center space-x-4">
        <h1 className="text-left font-semibold text-4xl">Routes Created</h1>
        <p className="font-semibold text-center text-sm">
          {new Date(startDate).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(endDate).toLocaleDateString("en-us", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-sm">
          {minToDays(totalUsedTime as number, true) as string}
        </p>
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
                    setSelectedMarker={setSelectedMarker}
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
              zoom={zoom}
              center={center}
              mapTypeId={window.google.maps.MapTypeId.ROADMAP}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                minHeight: "60vh",
                minWidth: "1px",
                flex: "1",
              }}
              ref={mapRef}
            >
              {locations.length &&
                locations.map((location) => (
                  <OverlayViewF
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
                          <h1 className="font-bold text-md">{location.name}</h1>
                          <p>{location.notes}</p>
                          <XMarkIcon
                            className="h-4 w-4 absolute top-1 right-1 cursor-pointer text-advus-brown-500"
                            onClick={() => setSelectedMarker("")}
                          />
                        </div>
                      )}
                    </>
                  </OverlayViewF>
                ))}
            </GoogleMap>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
}
