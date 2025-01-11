"use client";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import Btn from "@/components/ui-components/Btn";
import FormField from "@/components/ui-components/FormField";
import Link from "@/components/ui-components/Link";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";
import { Traveler } from "typings";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setTravelers as setSavedTravelers } from "@/redux/slices/tripSlice";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui-components/Spinner";

//TODO: Trigger validation when adding a traveler.

export default function TravelersPage() {
  const formRef = useRef(null);
  const dispatch = useAppDispatch();
  const { travelers: savedTravelers } = useAppSelector((state) => state.trip);
  const router = useRouter();
  const [travelers, setTravelers] = useState<Traveler[]>(savedTravelers);

  const handleSubmitForm = (setSubmitting: Function) => {
    setSubmitting(true);
    dispatch(setSavedTravelers(travelers));
    router.push("/itinerary/1");
    setSubmitting(false);
  };

  const handleAddTraveler = async () => {
    const name = formRef.current.elements.name.value;
    const email = formRef.current.elements.email.value;

    const traveler: Traveler = { name, email };

    const exisitingTraveler = travelers.find(
      (existingTraveler) =>
        existingTraveler.email === traveler.email &&
        existingTraveler.name === traveler.name
    );

    if (exisitingTraveler) {
    } else {
      setTravelers([...travelers, traveler]);
      formRef.current.elements.name.value = "";
      formRef.current.elements.email.value = "";

      console.log(formRef.current.elements);
    }
  };

  const handleRemoveTraveler = (travelerIdx: number) => {
    setTravelers(travelers.filter((traveler, idx) => idx !== travelerIdx));
  };

  const travelersSchema = Yup.object().shape({
    name: Yup.string()
      .typeError("Name is required")
      .required("Name is required"),
    email: Yup.string()
      .email()
      .typeError("A valid email is required")
      .required("Email is required"),
  });

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 relative">
        <div className="w-2/5 mb-20 flex items-center justify-center mt-36">
          <MainNavigationSteps currentStep={2} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
          <img
            className="mx-auto h-10 w-auto"
            src="/advus-banner-light.svg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">
            Add people to your trip
          </h2>
          <p className="text-xs mt-3 text-center">
            Add friends, family, whomever you're traveling with to begin
            collaborating and planning your trip together.
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          {travelers.map((traveler, idx) => (
            <div className="flex flex-col mb-3" key={`traveler-parent-${idx}`}>
              <div
                className="flex flex-grow justify-between items-center flex-row w-full"
                key={`traveler-container-${idx}`}
              >
                <div
                  className="block text-sm font-medium leading-6 text-black w-full mr-10"
                  key={`traveler-name-${idx}`}
                >
                  {traveler.name}
                </div>
                <div
                  className="block text-sm font-medium leading-6 text-black w-full"
                  key={`traveler-email-${idx}`}
                >
                  {traveler.email}
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-advus-red-500 hover:cursor-pointer"
                  onClick={() => handleRemoveTraveler(idx)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          ))}

          <Formik
            initialValues={{
              name: "",
              email: "",
            }}
            {...(!travelers.length && { validationSchema: travelersSchema })}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(setSubmitting)
            }
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              submitForm,
              validateForm,
              resetForm,
            }) => (
              <Form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex flex-row justify-between items-center space-x-6">
                  <div className="flex flex-grow flex-col">
                    <div>
                      <FormField
                        id="name"
                        name="name"
                        type="text"
                        fieldError={errors.name}
                        fieldTouched={touched.name}
                        textColor="text-black"
                      >
                        Name
                      </FormField>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-col">
                    <div>
                      <FormField
                        id="email"
                        name="email"
                        type="text"
                        fieldError={errors.email}
                        fieldTouched={touched.email}
                        textColor="text-black"
                      >
                        Email Address
                      </FormField>
                    </div>
                  </div>
                </div>
                <div className="flex w-full text-sm mt-3 justify-end text-advus-lightblue-500 font-semibold hover:text-advus-navyblue-500 transition-colors">
                  <div
                    className="hover:cursor-pointer"
                    onClick={async () => {
                      const validation = await validateForm();
                      handleAddTraveler();
                      resetForm();
                    }}
                  >
                    + Add another traveler
                  </div>
                </div>

                <div className="flex flex-row justify-between text-center items-center mt-6">
                  <Btn buttonType="secondary" type="submit" href="/details/3">
                    Back
                  </Btn>
                  <div className="flex flex-row space-x-6 justify-center items-center">
                    <Link href="/itinerary/1" linkType="secondary">
                      Skip
                    </Link>
                    <Btn
                      buttonType="primary"
                      type="submit"
                      onClickHandler={submitForm}
                    >
                      {isSubmitting ? <Spinner /> : "Next"}
                    </Btn>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
