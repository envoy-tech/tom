"use client";
import { useMemo, useState } from "react";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import Link from "../ui-components/Link";
import {
  ArrowLeftIcon,
  ListBulletIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import MapViewLocationPreferenceBox from "../ui-components/MapViewLocationPreferenceBox";

type MapViewProps = {
  showMapView: Function;
};

export default function MapView(props: MapViewProps) {
  const { showMapView } = props;
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
  const [zoom, setZoom] = useState(14);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={mapOptions}
          zoom={zoom}
          center={mapCenter}
          mapTypeId={window.google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{
            minHeight: "100%",
            minWidth: "100%",
          }}
        />
      ) : (
        "Loading..."
      )}
      <div className="z-10 absolute top-20 left-8 lg:top-20 lg:left-8 2xl:top-36 2xl:left-36 border-2 border-advus-brown-500 px-2 py-1 rounded-md bg-white hover:shadow-xl transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5">
        <Link
          href="/itinerary/2"
          linkType="tertiary"
          className="flex flex-row font-semibold sm:text-sm lg:text-md items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Return to Step 3: Create Your Itinerary
        </Link>
      </div>

      <div className="h-max w-1/2 z-10 absolute top-32 left-8 lg:w-5/12 lg:top-32 lg:left-8 xl:w-4/12 2xl:top-56 2xl:left-36">
        <MapViewLocationPreferenceBox />
      </div>
      <div className="z-10 absolute top-20 right-8 lg:top-20 lg:right-8 2xl:top-36 2xl:right-24 shadow-xl flex flex-row text-advus-lightblue-500 border-advus-lightblue-500 border-2 rounded-md bg-white px-3 py-1.5 space-x-3">
        <div className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 hover:cursor-pointer hover:text-advus-navyblue-500">
          <MapIcon className="h-6 w-6" />
          <p>Map View</p>
        </div>
        <div
          className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 text-gray-500 hover:cursor-pointer hover:text-advus-navyblue-500"
          onClick={() => showMapView(false)}
        >
          <ListBulletIcon className="h-6 w-6" />
          <p>List View</p>
        </div>
      </div>

      <div className="z-10 absolute bottom-24 right-8 lg:bottom-20 lg:right-8 2xl:bottom-36 2xl:right-24 space-y-2">
        <div
          className="bg-white border-2 border-advus-lightblue-500 text-advus-lightblue-500 rounded-md hover:shadow-xl transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5"
          onClick={() => setZoom(zoom + 1)}
        >
          <PlusIcon className="h-6 w-6" />
        </div>
        <div
          className="bg-white border-2 border-advus-lightblue-500 text-advus-lightblue-500 rounded-md hover:shadow-xl transition-all hover:-translate-y-1 hover:cursor-pointer active:translate-y-0.5"
          onClick={() => setZoom(zoom - 1)}
        >
          <MinusIcon className="h-6 w-6" />
        </div>
      </div>
    </>
  );
}
