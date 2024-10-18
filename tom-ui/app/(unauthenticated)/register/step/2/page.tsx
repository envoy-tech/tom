"use client";
import Link from "next/link";
import Steps from "@/components/page-components/Steps";
import Dropdown from "@/components/ui-components/Dropdown";
import Btn from "@/components/ui-components/Btn";
import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setEthnicity,
  setIncome,
  setPreferredSeason,
} from "@/redux/slices/userSlice";

export default function RegisterStep2() {
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  const { ethnicity, income, preferredSeason } = useAppSelector(
    (state) => state.user
  );

  const ethnicityOptions = [
    { name: "Select One", value: -1 },
    { name: "American Indian or Alaska Native", value: 0 },
    { name: "Asian", value: 1 },
    { name: "Black or African American", value: 2 },
    { name: "Native Hawaiian or Other Pacific Islander", value: 3 },
    { name: "White", value: 4 },
  ];

  const incomeOptions = [
    { name: "Select One", value: -1 },
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
    { name: "Select One", value: -1 },
    { name: "Fall", value: 0 },
    { name: "Winter", value: 1 },
    { name: "Spring", value: 2 },
    { name: "Summer", value: 3 },
  ];

  const submitForm = (e) => {
    const ethnicity = Number(
      formRef.current.elements["ethnicity[value]"].value
    );
    const income = Number(formRef.current.elements["income[value]"].value);
    const preferredSeason = Number(
      formRef.current.elements["season[value]"].value
    );

    if (ethnicity >= 0) {
      dispatch(setEthnicity(ethnicity));
    }

    if (income >= 0) {
      dispatch(setIncome(income));
    }

    if (preferredSeason >= 0) {
      dispatch(setPreferredSeason(preferredSeason));
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/advus-banner-dark.svg"
          alt="AdventurUs"
        />
        <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-white">
          Provide some additional details
        </h2>
        <p className="font-semibold text-xs text-center mt-2 text-white">
          To better your experience, provide some additional information below.
          Note: This is an optional step!
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-3" ref={formRef}>
          <Dropdown
            fieldName="Ethnicity (Optional)"
            items={ethnicityOptions}
            name="ethnicity"
            textColor="text-white"
            preselected={ethnicity >= 0 ? ethnicity : -1}
          />
          <Dropdown
            fieldName={"Income (Optional)"}
            items={incomeOptions}
            name="income"
            textColor="text-white"
            preselected={income >= 0 ? income : -1}
          />
          <Dropdown
            fieldName="Preferred Season to Travel (Optional)"
            items={preferredSeasonOptions}
            name="season"
            textColor="text-white"
            preselected={preferredSeason >= 0 ? preferredSeason : -1}
          />

          <div className="flex flex-row justify-end text-center items-center mt-3">
            <div className="flex flex-row justify-center items-center">
              <Link
                href="/register/step/3"
                className="font-semibold no-underline mr-3 text-white hover:underline"
              >
                Skip
              </Link>

              <Btn
                type="submit"
                buttonType="primary"
                href="/register/step/3"
                onClickHandler={submitForm}
              >
                Next
              </Btn>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-20">
        <Steps currentStep={2} numberOfSteps={4} />
      </div>
    </>
  );
}
