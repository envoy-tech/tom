"use client";
import Btn from "@/components/ui-components/Btn";
import { useEffect, useMemo, useState } from "react";

export default function OptimizingPage() {
  const [complete, setComplete] = useState(false);
  const loadingPrompts = [
    "Catching fireflies",
    "Quick! Take a photo",
    "Saw a moose!",
    "Oh no! A flat tire",
    "---Don't worry, we got It",
  ];

  // const currentPrompt = useMemo(
  //   () => loadingPrompts[Math.floor(Math.random() * loadingPrompts.length)],
  //   []
  // );

  useEffect(() => {
    setTimeout(() => setComplete(true), 5000);
  }, []);

  return (
    <div className="flex min-h-full w-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
        <img
          className="mx-auto h-10 w-auto"
          src="/advus-banner-light.svg"
          alt="Your Company"
        />
        {complete ? (
          <>
            <h1 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
              Your travel routes are ready
            </h1>
            <p className="text-sm text-center mt-3 mb-6">
              We have created a collection of itineraries for you and your
              fellow travelers to choose from using the information and
              preferences you provided.
            </p>
            <Btn buttonType="primary" type="button" href="/created">
              View routes
            </Btn>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
              Your trip is being optimized...
            </h1>
            <p className="text-sm text-center mt-3">
              Hang tight while we optimize your trip to generate the most ideal
              itineraries possible!
            </p>
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-600 rounded-md mt-6">
              <div className="h-3 bg-gradient-to-r from-advus-navyblue-500 to-advus-lightblue-500 w-1/2 rounded-md"></div>
            </div>
            <p className="mt-3">{loadingPrompts[0]}</p>
          </>
        )}
      </div>
    </div>
  );
}
