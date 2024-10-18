"use client";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import Btn from "@/components/ui-components/Btn";
import { useState } from "react";

export default function OptimizePage() {
  const [finished, setFinished] = useState(false);

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-start items-center px-6 py-12 lg:px-8 relative">
        <div className="w-2/5 mb-20 flex items-center justify-center mt-6">
          <MainNavigationSteps currentStep={5} />
        </div>
        {finished ? (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
              <img
                className="mx-auto h-10 w-auto"
                src="/advus-banner-light.svg"
                alt="Your Company"
              />
              <h1 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                Sit tight!
              </h1>
              <p className="text-sm text-center mt-3">
                Thanks for marking your part complete. Now, sit tight as your
                fellow travelers complete their part of the itinterary too.
              </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex flex-row justify-between text-center items-center mt-6">
                <Btn buttonType="secondary" type="submit" href="/details/1">
                  Edit itinerary
                </Btn>
                <Btn buttonType="primary" type="submit" href="/home">
                  Go to home
                </Btn>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
              <img
                className="mx-auto h-10 w-auto"
                src="/advus-banner-light.svg"
                alt="Your Company"
              />
              <h1 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
                Let's wrap up
              </h1>
              <p className="text-sm text-center mt-3">
                Use the button below to confirm that you have finished adding
                locations and preferences to your itinerary. Once all travelers
                have confirmed completion, the creator of your trip will be
                notified to begin the optimization process.
              </p>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex flex-row justify-between text-center items-center mt-6">
                <Btn buttonType="secondary" type="submit" href="/finalize">
                  Back
                </Btn>
                <Btn
                  buttonType="primary"
                  type="submit"
                  href="#"
                  onClickHandler={() => setFinished(true)}
                >
                  I'm finished
                </Btn>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
