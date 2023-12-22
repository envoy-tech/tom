"use client";
import { useState } from "react";

type ListViewLocationProps = {
  name: string;
  address: string;
};

export default function ListViewLocation(props: ListViewLocationProps) {
  const { name, address } = props;
  const [interest, setInterest] = useState(0);
  const [time, setTime] = useState(null);

  return (
    <div className="w-full flex flex-row">
      <div className="flex flex-col mr-auto">
        <p className="font-semibold">{name}</p>
        <p className="text-sm">{address}</p>
      </div>
      <div className="flex w-2/6 flex-row mt-1 mr-3 lg:mt-1 2xl:mt-3 items-center justify-end space-x-3">
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
              interest === 0
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => setInterest(0)}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
              interest === 1
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => setInterest(1)}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
              interest === 2
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => setInterest(2)}
          ></div>
        </div>
        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-8 items-center justify-start rounded-full ${
              interest === 3
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => setInterest(3)}
          ></div>
        </div>

        <div className="flex justify-center">
          <div
            className={`flex flex-col h-4 w-4 lg:h-4 lg:w-4 2xl:h-8 2xl:w-84 items-center justify-start rounded-full ${
              interest === 4
                ? "bg-advus-lightblue-500"
                : "border-2 bg-white border-advus-lightblue-500"
            }`}
            onClick={() => setInterest(4)}
          ></div>
        </div>
      </div>
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
    </div>
  );
}
