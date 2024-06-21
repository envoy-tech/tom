"use client";
import { PencilIcon, XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setLocationNote } from "@/redux/slices/tripSlice";

type LocationNoteBoxProps = {
  locationName: string;
  locationAddress: string;
  setSelectedMarker: Function;
};

export default function LocationNoteBox(props: LocationNoteBoxProps) {
  const { locationName, locationAddress, setSelectedMarker } = props;
  const locationState = useAppSelector((state) =>
    state.trip.locations.find(
      (location) => location.address === locationAddress
    )
  );
  const [edit, setEdit] = useState(false);
  const [noteText, setNoteText] = useState(
    locationState ? locationState.notes : ""
  );
  const dispatch = useAppDispatch();

  const handleSaveNote = () => {
    dispatch(setLocationNote({ address: locationAddress, notes: noteText }));
    setSelectedMarker(locationAddress);
    setEdit(false);
  };

  const handleCancelNote = () => {
    setEdit(false);
    setNoteText("");
  };

  return (
    <div className="flex justify-start items-start w-full flex-col space-y-2">
      <h1 className="font-semibold text-xl">{locationName}</h1>
      <p>{locationAddress}</p>

      {edit ? (
        <div className="w-full h-36 border-2 rounded-md border-gray-400 relative">
          <textarea
            className="w-full h-full absolute p-3 border-none bg-transparent resize-none"
            onChange={(e) => setNoteText(e.target.value)}
            value={noteText}
            maxLength={100}
          ></textarea>
          <div className="absolute bottom-2 left-2">
            Characters {noteText.length} / 100
          </div>
          <div className="absolute bottom-2 right-2 space-x-2 flex flex-row">
            <CheckIcon
              className="h-7 w-7 text-advus-lightblue-500 hover:cursor-pointer select-none"
              onClick={() => handleSaveNote()}
            />
            <XMarkIcon
              className="h-7 w-7 text-advus-brown-500 hover:cursor-pointer select-none"
              onClick={() => handleCancelNote()}
            />
          </div>
        </div>
      ) : (
        <>
          {noteText ? (
            <div
              className="flex flex-row text-advus-brown-500 hover:cursor-pointer select-none"
              onClick={() => setEdit(true)}
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Edit notes
            </div>
          ) : (
            <div
              className="flex flex-row text-advus-lightblue-500 hover:cursor-pointer select-none"
              onClick={() => setEdit(true)}
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Add notes
            </div>
          )}
        </>
      )}
    </div>
  );
}
