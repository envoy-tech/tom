"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { useState, Dispatch, SetStateAction } from "react";
import { useAppSelector } from "@/hooks/redux";

type RouteCreatedBoxProps = {
  locationName: string;
  locationAddress: string;
  setSelectedMarker: Dispatch<SetStateAction<string>>;
};

export default function RouteCreatedBox(props: RouteCreatedBoxProps) {
  const { locationName, locationAddress, setSelectedMarker } = props;
  const locationState = useAppSelector((state) =>
    state.trip.locations.find(
      (location) => location.address === locationAddress
    )
  );
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="flex justify-start items-start w-full flex-col space-y-2">
      <h1 className="font-semibold text-xl">{locationName}</h1>
      <p>{locationAddress}</p>

      <div className="flex flex-row justify-between w-2/3">
        <div
          className="flex flex-row text-advus-lightblue-500 hover:cursor-pointer select-none font-semibold"
          onClick={() => setShowNotes(!showNotes)}
        >
          View notes
          {showNotes ? (
            <ChevronUpIcon className="h-5 w-5 ml-1" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 ml-1" />
          )}
        </div>
        <div
          className="flex flex-row text-advus-lightblue-500 hover:cursor-pointer select-none font-semibold"
          onClick={() => setSelectedMarker(locationAddress)}
        >
          See on map
        </div>
      </div>
      {showNotes && <div>{locationState?.notes}</div>}
    </div>
  );
}
