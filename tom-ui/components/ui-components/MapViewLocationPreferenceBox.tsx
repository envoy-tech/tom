"use client";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Btn from "./Btn";
import {
  useState,
  useMemo,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useAppSelector } from "@/hooks/redux";
import { setLocationInterest, setLocationTime } from "@/redux/slices/tripSlice";
import { useAppDispatch } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import { minToDays } from "@/utils/time";
import Spinner from "./Spinner";

type MapViewLocationPreferenceBoxProps = {
  selectedMarker: string;
  setSelectedMarker: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function MapViewLocationPreferenceBox(
  props: MapViewLocationPreferenceBoxProps
) {
  const { selectedMarker, setSelectedMarker, setOpen } = props;
  const { locations, startDate, endDate } = useAppSelector(
    (state) => state.trip
  );
  const [currentLocation, setCurrentLocation] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitError, setShowSubmitError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const timeRemaining = useMemo(() => {
    if (locations.length) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.abs(start.getTime() - end.getTime());
      const minutes = diff / 1000 / 60;
      const totalUsedTime = locations.reduce(
        (acc, curr) => acc + curr.timeAllocated,
        0
      );

      return minutes - totalUsedTime;
    }
  }, [locations]);

  const handleNext = () => {
    // Check to see if all the locations have their time and interest set
    const unfilledLocations = locations.filter(
      (location) =>
        location.interest === undefined ||
        location.timeAllocated === undefined ||
        location.timeAllocated === 0
    );

    if (unfilledLocations.length) {
      setShowSubmitError(true);
    } else {
      setShowSubmitError(false);
      setSubmitting(true);
      router.push("/optimize");
      setSubmitting(false);
    }
  };

  const handleTime = (address: string) => {
    const days = Number(formRef.current.elements.days.value);
    const hours = Number(formRef.current.elements.hours.value);
    const mins = Number(formRef.current.elements.minutes.value);

    let timeAllocated = 0;

    if (days) {
      timeAllocated += days * 24 * 60;
    }

    if (hours) {
      timeAllocated += hours * 60;
    }

    if (mins) {
      timeAllocated += mins;
    }

    dispatch(setLocationTime({ address, timeAllocated }));
  };

  const handleInterest = (address: string, interest: number) => {
    dispatch(setLocationInterest({ address, interest }));
  };

  const handleTurnLocation = (locationIndex: number) => {
    setCurrentLocation(locationIndex);
    formRef.current.elements.days.value = 0;
    formRef.current.elements.hours.value = 0;
    formRef.current.elements.minutes.value = 0;
  };

  // Handle changing the selected marker
  useEffect(() => {
    if (selectedMarker) {
      setCurrentLocation(
        locations.findIndex((location) => location.address === selectedMarker)
      );
    }
  }, [selectedMarker]);

  // Handle changing the current location
  useEffect(() => {
    setSelectedMarker(locations[currentLocation].address);
  }, [currentLocation]);

  useEffect(() => {
    if (locations[currentLocation].timeAllocated) {
      const { days, hours, minutes } = minToDays(
        locations[currentLocation].timeAllocated,
        false
      ) as {
        days: number;
        hours: number;
        minutes: number;
      };

      formRef.current.elements.days.value = days;
      formRef.current.elements.hours.value = hours;
      formRef.current.elements.minutes.value = minutes;
    }
  }, [currentLocation]);

  return (
    <div className="h-full w-full bg-gray-100 rounded-md drop-shadow-lg border-gray-400 border-2 flex flex-col md:p-3 lg:p-3 2xl:p-3">
      <div className="w-full flex justify-end">
        <XMarkIcon
          className="w-6 h-6 lg:h-6 lg:w-6 2xl:h-8 2xl:w-8 text-advus-brown-500 cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <h1 className="font-semibold text-md lg:text-2xl 2xl:text-3xl">
        Finalize your trip by adding your preferences
      </h1>
      <p className="text-xs mt-2 lg:mt-2 lg:text-sm 2xl:mt-3 2xl:text-md">
        Below, rate and indicate how much time you would like to spend at each
        of the locations added to your itinerary.
      </p>
      <div className="mt-2 p-3 lg:mt-2 lg:p-3 2xl:mt-3 2xl:p-3 h-full w-full bg-advus-lightblue-100 rounded-md flex flex-col">
        <p className="text-advus-navyblue-500 text-xs lg:text-xs">
          Location {currentLocation + 1} of {locations.length}
        </p>
        <h1 className="font-semibold text-sm lg:text-sm lg:mt-1 2xl:text-xl 2xl:mt-3">
          {locations[currentLocation]?.name}
        </h1>
        <p className="text-md lg:text-md 2xl:text-lg">
          {locations[currentLocation]?.address}
        </p>
        <p className="text-sm lg:text-sm lg:mt-1 2xl:text-lg 2xl:mt-3">
          Q1. How interested are you in visiting this location?
        </p>
        <div className="flex w-full flex-row 2xl:mt-3 lg:mt-1 items-end">
          <div className="flex flex-col justify-center items-center 2xl:space-y-3 lg:space-y-2 w-1/5">
            <p className="italic text-xs lg:text-xs">Not interested</p>
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-6 2xl:w-6 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
                locations[currentLocation].interest === 0
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() =>
                handleInterest(locations[currentLocation].address, 0)
              }
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-6 2xl:w-6 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
                locations[currentLocation].interest === 1
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() =>
                handleInterest(locations[currentLocation].address, 1)
              }
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-6 2xl:w-6 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
                locations[currentLocation].interest === 2
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() =>
                handleInterest(locations[currentLocation].address, 2)
              }
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-6 2xl:w-6 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
                locations[currentLocation].interest === 3
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() =>
                handleInterest(locations[currentLocation].address, 3)
              }
            ></div>
          </div>

          <div className="flex flex-col justify-center items-center 2xl:space-y-3 lg:space-y-2 w-1/5">
            <p className="italic text-xs lg:text-xs">Very interested</p>
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-6 2xl:w-6 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
                locations[currentLocation].interest === 4
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() =>
                handleInterest(locations[currentLocation].address, 4)
              }
            ></div>
          </div>
        </div>
        <p className="text-sm mt-2 lg:text-sm lg:mt-2 2xl:text-lg 2xl:mt-3">
          Q2. How long would you like to stay at this location?
        </p>
        <div className="lg:mt-1 flex flex-col justify-center items-center w-full">
          <form ref={formRef}>
            <div className="flex flex-row items-center text-sm">
              <input
                id="days"
                name="days"
                type="number"
                autoComplete="days"
                onChange={() => handleTime(locations[currentLocation].address)}
                className="block w-8 h-6 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6"
              />
              days
              <input
                id="hours"
                name="hours"
                type="number"
                autoComplete="hours"
                onChange={() => handleTime(locations[currentLocation].address)}
                className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6 border-none"
              />
              hrs
              <input
                id="minutes"
                name="minutes"
                type="number"
                autoComplete="minutes"
                onChange={() => handleTime(locations[currentLocation].address)}
                className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6"
              />
              min
            </div>
          </form>

          <p className="italic text-xs lg:text-xs mt-1">
            Time remaining to allocate:{" "}
            <strong className="font-semibold">
              {minToDays(timeRemaining as number, true) as string}
            </strong>
          </p>
        </div>
      </div>
      <div className="flex justify-end mt-3 text-sm text-advus-red-500">
        {showSubmitError &&
          "Please fill the preferences on the form completely."}
      </div>
      <div className="h-9 w-full flex justify-between mt-3">
        <div className="flex flex-row space-x-5">
          <Btn
            buttonType="secondary"
            type="button"
            length="short"
            disabled={currentLocation === 0}
            onClickHandler={() => handleTurnLocation(currentLocation - 1)}
          >
            Previous
          </Btn>
          <Btn
            buttonType="primary"
            type="button"
            length="default"
            disabled={currentLocation === locations.length - 1}
            onClickHandler={() => handleTurnLocation(currentLocation + 1)}
          >
            Next Location
          </Btn>
        </div>
        <Btn
          buttonType="primary"
          type="button"
          length="long"
          onClickHandler={handleNext}
        >
          {submitting ? <Spinner /> : "Next"}
        </Btn>
      </div>
    </div>
  );
}
