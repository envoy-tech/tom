import Link from "next/link";
import Steps from "@/components/page-components/Steps";
import Btn from "@/components/ui-components/Btn";

export default function RegisterStep3() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/advus-banner-dark.svg"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-white">
          Here's how it works
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md text-white">
        <ul className="space-y-12 mb-12">
          <li className="relative flex flex-row items-center justify-start">
            <span
              className="absolute h-12 w-12 rounded-full bg-advus-brown-500 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-semibold text-3xl text-center">1</span>
            </span>

            <span className="ml-16 text-sm">
              <strong>Select your destination.</strong> blah blah blah
            </span>
          </li>
          <li className="relative flex flex-row items-center justify-start">
            <span
              className="absolute h-12 w-12 rounded-full bg-advus-brown-500 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-semibold text-3xl text-center">2</span>
            </span>

            <span className="ml-16 text-sm">
              <strong>Select the places you want to visit.</strong> blah blah
              blah
            </span>
          </li>
          <li className="relative flex flex-row items-center justify-start">
            <span
              className="absolute h-12 w-12 rounded-full bg-advus-brown-500 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-semibold text-3xl text-center">3</span>
            </span>

            <span className="ml-16 text-sm">
              <strong>
                Select how long you want to stay at each location, and then rank
                them.
              </strong>
              blah blah blah
            </span>
          </li>
          <li className="relative flex flex-row items-center justify-start">
            <span
              className="absolute h-12 w-12 rounded-full bg-advus-brown-500 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="font-semibold text-3xl text-center">4</span>
            </span>

            <span className="ml-16 text-sm">
              <strong>We'll take over from there.</strong> blah blah blah
            </span>
          </li>
        </ul>
        <div className="flex flex-row justify-between text-center items-center mt-3">
          <Btn type="button" buttonType="secondary" href="/register/step/2">
            Back
          </Btn>

          <Btn type="submit" buttonType="primary" href="/register/step/4">
            Next
          </Btn>
        </div>
      </div>
      <div className="mt-20">
        <Steps currentStep={3} numberOfSteps={4} />
      </div>
    </>
  );
}
