"use client";
import Link from "next/link";
import Steps from "@/components/page-components/Steps";
import Btn from "@/components/ui-components/Btn";
import { useAppSelector } from "@/hooks/redux";

export default function RegisterStep4() {
  const referred = useAppSelector((state) => state.user.referred);

  // TODO: keep this component a server component, abstract out the client component stuff so we can make API requests for referred state.

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          {referred ? (
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Let's go to [END LOCATION NAME]
            </h2>
          ) : (
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Ready to go
            </h2>
          )}
        </div>

        {referred ? (
          <p></p>
        ) : (
          <p className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            Let’s start by selecting the dates and destination of your first
            trip. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-3" action="#" method="POST">
            <div className="flex flex-row justify-between text-center items-center mt-3">
              <Link href="/register/step/3">
                <Btn type="button" buttonType="secondary">
                  Back
                </Btn>
              </Link>
              <Link href="/signin?fromSignupFlow=true">
                <Btn type="submit" buttonType="primary">
                  Next
                </Btn>
              </Link>
            </div>
          </form>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={4} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
