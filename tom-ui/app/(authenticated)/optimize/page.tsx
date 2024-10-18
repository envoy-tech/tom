"use client";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import Btn from "@/components/ui-components/Btn";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function OptimizePage() {
  const [finished, setFinished] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleOptimize = () => {
    setShowDialog(true);
  };

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
                Ready to optimize?
              </h1>
              <p className="text-sm text-center mt-3">
                We have collected all of the information we need from everyone
                traveling with you, and your trip is ready to be optimized.
                Click on the button below, and we'll get to work to create
                various, ideal routes for your trip.
              </p>
            </div>
            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex flex-row justify-between text-center items-center mt-6">
                <Btn buttonType="secondary" type="submit" href="/details/1">
                  Edit itinerary
                </Btn>
                <Btn
                  buttonType="primary"
                  type="submit"
                  href="#"
                  onClickHandler={handleOptimize}
                >
                  Optimize
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
                have confirmed completion, we will send you an email letting you
                know your trip is ready to be optimized.
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

        {showDialog && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-start w-2/5 md:w-3/5 bg-white p-6 shadow-lg rounded-md">
            <div className="w-full flex items-center justify-end">
              <XMarkIcon className="h-6 w-6 text-advus-brown-500" />
            </div>
            <h1 className="text-2xl font-semibold mt-3">
              Looks like your fellow travelers are not finished yet.
            </h1>
            <p className="text-sm mt-3">
              The other travelers on your trip have not confirmed if they've
              finished completing their portions of the itinerary. You can
              either wait for the other travelers to finish, or you can proceed
              forward with having your trip optimized. Note: You will not be
              able to edit your itinerary once you optimize your trip. Please
              confirm that you want to continue and optimize your trip by
              clicking on the button “Yes, optimize” below.
            </p>
            <div className="flex flex-row justify-end w-full space-x-3 mt-6">
              <Btn
                buttonType="secondary"
                type="submit"
                href="#"
                onClickHandler={() => setShowDialog(false)}
              >
                Cancel
              </Btn>
              <Btn buttonType="primary" type="submit" href="/optimizing">
                Yes, optimize
              </Btn>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
