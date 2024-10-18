"use client";
import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getLatLng,
  getGeocode,
} from "use-places-autocomplete";
import { addLocation, removeLocation } from "@/redux/slices/tripSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";

type LocationBoxProps = {
  locationName: string;
  locationAddress: string;
  locationDescription: string;
};

const getLatLong = async (address: string) => {
  const geocode = await getGeocode({ address });
  const { lat, lng } = getLatLng(geocode[0]);
  return { lat, long: lng };
};

export default function LocationBox(props: LocationBoxProps) {
  const { locationName, locationAddress, locationDescription } = props;
  const { clearSuggestions } = usePlacesAutocomplete();
  const dispatch = useAppDispatch();
  const { locations } = useAppSelector((state) => state.trip);
  const [added, setAdded] = useState(
    locations.findIndex((location) => location.address === locationAddress) !==
      -1
  );

  const handleAddLocation = async () => {
    const { lat, long } = await getLatLong(locationDescription);

    // TODO: Handle adding a duplicate location

    dispatch(
      addLocation({
        notes: "",
        timeAllocated: undefined,
        interest: undefined,
        name: locationName,
        lat,
        long,
        address: locationAddress,
      })
    );
    clearSuggestions();
    setAdded(true);
  };

  const handleRemoveLocation = () => {
    dispatch(removeLocation(locationAddress));
    setAdded(false);
  };

  // Try to find a location if it exists already
  useEffect(() => {
    locations.map((location) => {
      if (locationAddress === location.address) {
        setAdded(true);
      }
    });
  }, [locations]);

  return (
    <div className="flex justify-between w-11/12 flex-row">
      <div className="flex justify-start items-start w-full flex-col">
        <h1 className="font-semibold text-xl">{locationName}</h1>
        <p className="mt-2">{locationAddress}</p>
      </div>
      {added ? (
        <div
          className="flex flex-row justify-center items-center hover:cursor-pointer select-none text-advus-brown-500"
          onClick={handleRemoveLocation}
        >
          <TrashIcon className="h-5 w-5 mr-2 text-advus-brown-500" />
          Remove
        </div>
      ) : (
        <div
          className="flex flex-row justify-center items-center hover:cursor-pointer select-none text-advus-lightblue-500"
          onClick={handleAddLocation}
        >
          <PlusIcon className="h-5 w-5 mr-2 text-advus-lightblue-500" />
          Add
        </div>
      )}
    </div>
  );
}
