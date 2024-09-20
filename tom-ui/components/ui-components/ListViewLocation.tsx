"use client";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setLocationTime, setLocationInterest } from "@/redux/slices/tripSlice";
import { minToDays } from "@/utils/time";

type ListViewLocationProps = {
  name: string;
  address: string;
  interest?: number;
  timeAllocated?: number;
};

export default function ListViewLocation(props: ListViewLocationProps) {
  const { name, address, interest, timeAllocated } = props;
  const dispatch = useAppDispatch();
  const daysRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);

  const handleInterest = (index: number) => {
    dispatch(setLocationInterest({ address: address, interest: index }));
  };

  const handleTime = () => {
    const days = Number(daysRef.current.value);
    const hours = Number(hoursRef.current.value);
    const mins = Number(minutesRef.current.value);

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

  useEffect(() => {
    if (timeAllocated) {
      const { days, hours, minutes } = minToDays(timeAllocated, false) as {
        days: number;
        hours: number;
        minutes: number;
      };

      daysRef.current.value = days;
      hoursRef.current.value = hours;
      minutesRef.current.value = minutes;
    }
  }, []);

  return (
    <div className="w-full flex flex-row">
      <div className="flex flex-col mr-auto">
        <p className="font-semibold">{name}</p>
        <p className="text-sm">{address}</p>
      </div>
      <div className="flex w-2/6 flex-row mr-3 items-center justify-end space-x-3">
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
              interest === 0
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => handleInterest(0)}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
              interest === 1
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => handleInterest(1)}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
              interest === 2
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => handleInterest(2)}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
              interest === 3
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => handleInterest(3)}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full cursor-pointer transition-colors hover:bg-advus-lightblue-300 ${
              interest === 4
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => handleInterest(4)}
          ></div>
        </div>
      </div>
      <div className="flex flex-row items-center text-sm">
        <input
          id="days"
          name="days"
          type="number"
          autoComplete="days"
          ref={daysRef}
          onChange={handleTime}
          className="block w-8 h-6 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6 focus:outline-none"
        />
        days
        <input
          id="hours"
          name="hours"
          type="number"
          autoComplete="hours"
          ref={hoursRef}
          onChange={handleTime}
          className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6 focus:outline-none"
        />
        hrs
        <input
          id="minutes"
          name="minutes"
          type="number"
          autoComplete="minutes"
          ref={minutesRef}
          onChange={handleTime}
          className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6 focus:outline-none"
        />
        min
      </div>
    </div>
  );
}
