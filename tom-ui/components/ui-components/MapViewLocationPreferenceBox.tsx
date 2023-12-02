"use client";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Btn from "./Btn";
import { useState } from "react";

export default function MapViewLocationPreferenceBox() {
  const [interest, setInterest] = useState(0);

  return (
    <div className="h-full w-full bg-gray-100 rounded-md shadow-lg border-gray-400 border-2 flex flex-col md:p-3 lg:p-3 2xl:p-9">
      <div className="w-full flex justify-end">
        <XMarkIcon className="w-6 h-6 lg:h-6 lg:w-6 2xl:h-12 2xl:w-12 text-advus-brown-500" />
      </div>

      <h1 className="font-semibold text-md lg:text-2xl 2xl:text-4xl">
        Finalize your trip by adding your preferences
      </h1>
      <p className="text-xs mt-2 lg:mt-2 lg:text-sm 2xl:mt-6 2xl:text-lg">
        Below, rate and indicate how much time you would like to spend at each
        of the locations added to your itinerary.
      </p>
      <div className="mt-2 p-3 lg:mt-2 lg:p-3 2xl:mt-6 2xl:p-6 h-full w-full bg-advus-lightblue-100 rounded-md flex flex-col">
        <p className="text-advus-navyblue-500 text-xs lg:text-xs">
          Location 1 of 21
        </p>
        <h1 className="font-semibold text-sm lg:text-sm lg:mt-1 2xl:text-2xl 2xl:mt-6">
          Location A
        </h1>
        <p className="text-md lg:text-md 2xl:text-xl">Address example 1</p>
        <p className="text-sm lg:text-sm lg:mt-1 2xl:text-xl 2xl:mt-6">
          Q1. How interested are you in visiting this location?
        </p>
        <div className="flex w-full flex-row 2xl:mt-3 lg:mt-1 items-end">
          <div className="flex flex-col justify-center items-center 2xl:space-y-6 lg:space-y-2 w-1/5">
            <p className="italic text-xs lg:text-xs">Not interested</p>
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
                interest === 0
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() => setInterest(0)}
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
                interest === 1
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() => setInterest(1)}
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
                interest === 2
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() => setInterest(2)}
            ></div>
          </div>
          <div className="w-1/5 flex justify-center">
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
                interest === 3
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() => setInterest(3)}
            ></div>
          </div>

          <div className="flex flex-col justify-center items-center 2xl:space-y-6 lg:space-y-2 w-1/5">
            <p className="italic text-xs lg:text-xs">Very interested</p>
            <div
              className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
                interest === 4
                  ? "bg-advus-lightblue-500"
                  : "border-2 bg-white border-advus-lightblue-500"
              }`}
              onClick={() => setInterest(4)}
            ></div>
          </div>
        </div>
        <p className="text-sm mt-2 lg:text-sm lg:mt-2 2xl:text-xl 2xl:mt-6">
          Q2. How long would you like to stay at this location?
        </p>
        <div className="lg:mt-1 flex flex-col justify-center items-center w-full">
          <div className="flex flex-row items-center text-sm">
            <input
              id="days"
              name="days"
              type="text"
              autoComplete="days"
              className="block w-8 h-6 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6"
            />
            days
            <input
              id="hours"
              name="hours"
              type="text"
              autoComplete="hours"
              className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6"
            />
            hrs
            <input
              id="minutes"
              name="minutes"
              type="text"
              autoComplete="minutes"
              className="block w-8 h-6 ml-2 mr-2 rounded-md border-0 px-2 py-1.5 text-md text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-xs sm:leading-6"
            />
            min
          </div>
          <p className="italic text-xs lg:text-xs mt-1">
            Time remaining to allocate:{" "}
            <strong className="font-semibold">8 days 2 hrs 45 min</strong>
          </p>
        </div>
      </div>
      <div className="h-9 w-full flex justify-end mt-3 lg:mt-3 2xl:mt-9">
        <Btn buttonType="primary" type="button" length="long">
          Save
        </Btn>
      </div>
    </div>
  );
}
