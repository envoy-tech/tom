"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { ListBulletIcon } from "@heroicons/react/20/solid";
import { MapIcon } from "@heroicons/react/24/outline";
import Btn from "@/components/ui-components/Btn";
import LocationBox from "@/components/ui-components/LocationBox";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import LocationListViewBox from "@/components/ui-components/LocationListViewBox";
import GooglePlacesSearchField from "@/components/ui-components/GooglePlacesSearchField";
import { type Suggestions } from "use-places-autocomplete";
import { useAppSelector } from "@/hooks/redux";

const libraries = ["places"];
const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: true,
  scrollwheel: true,
};
const mapCenter = { lat: 27.672932021393862, lng: 85.31184012689732 };

const mapMarker = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
</svg>
`;

export default function ItineraryPageStepOne() {
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  const mapRef = useRef(null);
  const [showMapView, setShowMapView] = useState(true);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API as string,
    libraries: libraries as any,
  });
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const { locations } = useAppSelector((state) => state.trip);
  const [center, setCenter] = useState(mapCenter);

  useEffect(() => {
    if (locations.length && mapRef.current && isLoaded) {
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
  }, [locations, isLoaded]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6 py-12 lg:px-8">
      <div className="w-2/5 mb-20 flex items-center justify-center mt-6">
        <MainNavigationSteps currentStep={3} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-center mt-6 space-x-10">
        <div className="h-full flex flex-col justify-start items-start">
          <p className="text-xs">STEP 1 OF 2</p>
          <h1 className="text-left font-semibold text-3xl mt-2">
            Add the places you want to visit
          </h1>
          <p className="text-left text-s mt-3">
            Use the search bar below to look up and add as many places you want
            to the trip
          </p>
          <div className="w-full mt-6">
            {isLoaded && (
              <GooglePlacesSearchField setSuggestions={setSuggestions} />
            )}
          </div>

          <div className="w-full flex flex-col justify-start mt-3">
            <p className="text-xs text-gray-400">SEARCH RESULTS</p>
            <div className="w-full flex flex-col mt-3 border-b-2 bordery-gray-400 pb-3">
              <div className="overflow-y-scroll h-96 space-y-4 pr-3">
                {suggestions &&
                  suggestions.data.map((location, index) => (
                    <div className="space-y-3" key={`location-${index}`}>
                      <LocationBox
                        locationName={location.structured_formatting.main_text}
                        locationAddress={
                          location.structured_formatting.secondary_text
                        }
                        locationDescription={location.description}
                      />
                      {index !== suggestions.data.length - 1 && (
                        <div className="border-gray-400 border-b-2 w-full"></div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full flex flex-row justify-between mt-3">
              <Btn buttonType="secondary" type="submit" href="/travelers">
                Back
              </Btn>
              <Btn buttonType="primary" type="submit" href="/itinerary/2">
                Next
              </Btn>
            </div>
          </div>
        </div>
        <div className="h-full w-full flex items-start justify-start flex-col">
          <div className="w-full flex flex-row justify-start space-x-3 mb-3 text-xl font-semibold">
            <div
              className={`flex flex-col justify-center items-center hover:cursor-pointer select-none ${
                showMapView ? "text-advus-lightblue-500" : "text-gray-800"
              }`}
              onClick={(e) => setShowMapView(true)}
            >
              <div className="flex flex-row justify-center items-center md:text-sm">
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
              <div className="flex flex-row justify-center items-center md:text-sm">
                <ListBulletIcon className="h-5 w-5 mr-1" /> List View
              </div>

              {!showMapView && (
                <div className="border-advus-lightblue-500 border-b-2 w-full"></div>
              )}
            </div>
          </div>
          <div className="w-full h-full">
            {showMapView ? (
              isLoaded ? (
                <GoogleMap
                  options={mapOptions}
                  zoom={6}
                  center={center}
                  mapTypeId={window.google.maps.MapTypeId.ROADMAP}
                  mapContainerStyle={{
                    minHeight: "650px",
                    width: "100%",
                    height: "100%",
                  }}
                  ref={mapRef}
                  onLoad={onMapLoad}
                >
                  {locations.length &&
                    locations.map((location) => (
                      <Marker
                        key={`${location.name}-${location.address}`}
                        position={{ lat: location.lat, lng: location.long }}
                      />
                    ))}
                </GoogleMap>
              ) : (
                "Loading..."
              )
            ) : (
              <div className="border-gray-400 border-2 w-full h-96 flex flex-col justify-center items-center space-y-3 p-6 overflow-y-scroll">
                {locations &&
                  locations.map((location, index) => (
                    <div
                      className="w-full h-full space-y-3"
                      key={`location-list-${index}`}
                    >
                      <LocationListViewBox
                        locationName={location.name}
                        locationAddress={location.address}
                        index={index + 1}
                      />
                      {index !== locations.length - 1 && (
                        <div className="border-gray-400 border-b-2 w-full"></div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
