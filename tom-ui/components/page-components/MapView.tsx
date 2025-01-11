"use client";
import { useState, useEffect, useRef } from "react";
import { useJsApiLoader, GoogleMap, OverlayView } from "@react-google-maps/api";
import Link from "../ui-components/Link";
import {
  ArrowLeftIcon,
  ListBulletIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { MapIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/hooks/redux";
import { getZoom } from "@/utils/google-maps";
import Marker from "../ui-components/Marker";
import { XMarkIcon, ArrowDownRightIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

const MapViewLocationPreferenceBox = dynamic(
  () => import("../ui-components/MapViewLocationPreferenceBox"),
  { ssr: false }
);

type MapViewProps = {
  showMapView: Function;
};

const libraries = ["places"];
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
};
const mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 };

export default function MapView(props: MapViewProps) {
  const { showMapView } = props;
  const [zoom, setZoom] = useState(14);
  const { locations } = useAppSelector((state) => state.trip);
  const [center, setCenter] = useState(mapCenter);
  const [open, setOpen] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState("");
  const mapRef = useRef(null);

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
    <>
      {isLoaded ? (
        <GoogleMap
          options={mapOptions}
          zoom={zoom}
          center={center}
          mapTypeId={window.google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{
            minHeight: "100%",
            minWidth: "100%",
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
                    <Marker selected={location.address === selectedMarker} />
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
              </OverlayView>
            ))}
        </GoogleMap>
      ) : (
        "Loading..."
      )}
      <div className="z-10 absolute top-20 left-8 lg:top-20 lg:left-8 2xl:top-24 2xl:left-10 border-2 border-advus-brown-500 px-2 py-1 rounded-md bg-white hover:shadow-xl transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5">
        <Link
          href="/itinerary/2"
          linkType="tertiary"
          className="flex flex-row font-semibold sm:text-sm lg:text-md items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Return to Step 3: Create Your Itinerary
        </Link>
      </div>

      <motion.div className="h-max w-1/2 z-10 absolute top-32 left-8 lg:w-5/12 lg:top-32 lg:left-8 xl:w-4/12 2xl:top-36 2xl:left-10">
        {open ? (
          <MapViewLocationPreferenceBox
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
            setOpen={setOpen}
          />
        ) : (
          <div className="w-8 h-8 border-2 border-advus-lightblue-500 rounded-md bg-white flex justify-center items-center">
            <ArrowDownRightIcon
              className="h-5 w-5 text-advus-lightblue-500 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
        )}
      </motion.div>
      <div className="z-10 absolute top-20 right-8 lg:top-20 lg:right-8 2xl:top-24 2xl:right-10 drop-shadow-lg flex flex-row text-advus-lightblue-500 border-advus-lightblue-500 border-2 rounded-md bg-white px-3 py-1.5 space-x-3">
        <div className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 hover:cursor-pointer hover:text-advus-navyblue-500 transition-colors">
          <MapIcon className="h-6 w-6" />
          <p>Map View</p>
        </div>
        <div
          className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 text-gray-500 hover:cursor-pointer hover:text-advus-navyblue-500 transition-colors"
          onClick={() => showMapView(false)}
        >
          <ListBulletIcon className="h-6 w-6" />
          <p>List View</p>
        </div>
      </div>

      <div className="z-10 absolute bottom-24 right-8 lg:bottom-20 lg:right-8 2xl:bottom-24 2xl:right-10 space-y-2">
        <div
          className="bg-white border-2 border-advus-lightblue-500 text-advus-lightblue-500 rounded-md drop-shadow hover:drop-shadow-lg transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5 active:drop-shadow-sm"
          onClick={() => setZoom(zoom + 1)}
        >
          <PlusIcon className="h-6 w-6" />
        </div>
        <div
          className="bg-white border-2 border-advus-lightblue-500 text-advus-lightblue-500 rounded-md drop-shadow hover:drop-shadow-lg transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5 active:drop-shadow-sm"
          onClick={() => setZoom(zoom - 1)}
        >
          <MinusIcon className="h-6 w-6" />
        </div>
      </div>
    </>
  );
}
