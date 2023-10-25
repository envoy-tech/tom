"use client";
import { useEffect } from "react";
import Btn from "@/components/ui-components/Btn";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  return (
    <div className="grid h-screen px-4 bg-white place-content-center">
      <div className="text-center">
        <h1 className="font-black text-gray-200 text-9xl">401</h1>
        <h2 className="font-black text-gray-200 text-7xl">{error.message}</h2>

        <Btn type="button" onClickHandler={() => reset()} buttonType="primary">
          Try Again
        </Btn>
      </div>
    </div>
  );
}
