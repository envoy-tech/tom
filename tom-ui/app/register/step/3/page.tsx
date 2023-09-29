import Link from "next/link";
import Steps from "@/components/page-components/Steps";
import Btn from "@/components/ui-components/Btn";

export default function RegisterStep3() {
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Here's how it works
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <ul className="space-y-3">
            <li className="flex flex-row items-center justify-start">
              <span className="font-bold text-3xl mr-4">1</span>
              <span className="text-sm">
                <strong>Select your destination.</strong> blah blah blah
              </span>
            </li>
            <li className="flex flex-row items-center justify-start">
              <span className="font-bold text-3xl mr-4">2</span>
              <span className="text-sm">
                <strong>Select the places you want to visit.</strong> blah blah
                blah
              </span>
            </li>
            <li className="flex flex-row items-center justify-start">
              <span className="font-bold text-3xl mr-4">3</span>
              <span className="text-sm">
                <strong>
                  Select how long you want to stay at each location, and then
                  rank them.
                </strong>
                blah blah blah
              </span>
            </li>
            <li className="flex flex-row items-center justify-start">
              <span className="font-bold text-3xl mr-4">4</span>
              <span className="text-sm">
                <strong>We'll take over from there.</strong> blah blah blah
              </span>
            </li>
          </ul>
          <div className="flex flex-row justify-between text-center items-center mt-3">
            <Link href="/register/step/2">
              <Btn type="button" buttonType="secondary">
                Back
              </Btn>
            </Link>
            <Link href="/register/step/4">
              <Btn type="submit" buttonType="primary">
                Next
              </Btn>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={3} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
