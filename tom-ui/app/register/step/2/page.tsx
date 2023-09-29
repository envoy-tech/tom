"use client";
import Link from "next/link";
import Steps from "@/components/page-components/Steps";
import Dropdown from "@/components/ui-components/Dropdown";
import Btn from "@/components/ui-components/Btn";
import { useRef } from "react";

export default function RegisterStep2() {
  const formRef = useRef(null);

  const ethnicityOptions = [
    { name: "American Indian or Alaska Native", value: 0 },
    { name: "Asian", value: 1 },
    { name: "Black or African American", value: 2 },
    { name: "Native Hawaiian or Other Pacific Islander", value: 3 },
    { name: "Black or African American", value: 4 },
    { name: "White", value: 5 },
  ];

  const incomeOptions = [
    { name: " < $15,000", value: 0 },
    { name: "$15,000 - $24,999", value: 1 },
    { name: "$25,000 - $34,999", value: 2 },
    { name: "$35,000 - $49,999", value: 3 },
    { name: "$50,000 - $74,999", value: 4 },
    { name: "$75,000 - $99,999", value: 5 },
    { name: "$100,000 - $149,999", value: 6 },
    { name: "$150,000 - $199,999", value: 7 },
    { name: " > $200,000", value: 8 },
  ];

  const preferredSeasonOptions = [
    { name: "Fall", value: 0 },
    { name: "Winter", value: 1 },
    { name: "Spring", value: 2 },
    { name: "Summer", value: 3 },
  ];

  const submitForm = (e) => {
    e.preventDefault();
    console.log(formRef.current.elements["ethnicity[value]"]);
  };

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
            Provide some additional details
          </h2>
          <p className="font-semibold text-xs text-center mt-2">
            To better your experience, provide some additional information
            below. Note: This is an optional step!
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form className="space-y-3" ref={formRef} onSubmit={submitForm}>
            <Dropdown
              fieldName="Ethnicity (Optional)"
              items={ethnicityOptions}
              name="ethnicity"
            />
            <Dropdown
              fieldName={"Income (Optional)"}
              items={incomeOptions}
              name="income"
            />
            <Dropdown
              fieldName="Preferred Season to Travel (Optional)"
              items={preferredSeasonOptions}
              name="season"
            />

            <div className="flex flex-row justify-between text-center items-center mt-3">
              <Link href="/register/step/1">
                <Btn type="button" buttonType="secondary">
                  Back
                </Btn>
              </Link>
              <div className="flex flex-row justify-center items-center">
                <Link
                  href="/register/step/3"
                  className="font-semibold underline mr-3"
                >
                  Skip
                </Link>
                <Link href="/register/step/3">
                  <Btn type="submit" buttonType="primary">
                    Next
                  </Btn>
                </Link>
              </div>
            </div>
          </form>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={2} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
