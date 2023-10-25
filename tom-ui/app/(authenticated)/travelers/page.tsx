"use client";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import Btn from "@/components/ui-components/Btn";
import FormField from "@/components/ui-components/FormField";
import Link from "@/components/ui-components/Link";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";

type Traveler = {
  name: string;
  email: string;
};

export default function DetailsPageStepOne() {
  const formRef = useRef(null);
  const [travelers, setTravelers] = useState<Traveler[]>([]);

  const handleSubmitForm = (
    name: string,
    email: string,
    setSubmitting: Function
  ) => {};

  const handleAddTraveler = () => {
    const name = formRef.current.elements.name.value;
    const email = formRef.current.elements.email.value;

    const traveler: Traveler = { name, email };

    setTravelers([...travelers, traveler]);

    console.log(travelers);
  };

  const handleRemoveTraveler = (travelerIdx: number) => {
    setTravelers(travelers.filter((traveler, idx) => idx !== travelerIdx));
  };

  const detailsSchema = Yup.object().shape({
    name: Yup.string()
      .typeError("Name is required")
      .required("Name is required"),
    approximatedate: Yup.string().required("This field is required."),
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
        <div className="w-100 mb-20 flex items-center justify-center">
          <MainNavigationSteps currentStep={2} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
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
            validationSchema={detailsSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(values.name, values.email, setSubmitting)
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
              /* and other goodies */
            }) => (
              <Form ref={formRef}>
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
                <div className="flex w-full text-sm mt-3 justify-end text-advus-lightblue-500 font-semibold">
                  <div
                    className="hover:cursor-pointer"
                    onClick={handleAddTraveler}
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
                    <Btn buttonType="primary" type="submit" href="/itinerary/1">
                      Next
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
