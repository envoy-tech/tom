"use client";
import Link from "next/link";
import Spinner from "@/components/ui-components/Spinner";
import FormField from "@/components/ui-components/FormField";
import Btn from "@/components/ui-components/Btn";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRef, useState } from "react";

export default function DetailsPageStepOne() {
  const formRef = useRef(null);
  const [isApproxDate, setIsApproxDate] = useState(false);

  const handleSubmitForm = (
    startdate: string,
    enddate: string,
    approxmiatedate: string,
    setSubmitting: Function
  ) => {};

  const detailsSchema = Yup.object().shape({
    startdate: Yup.date()
      .typeError("Start Date is required")
      .required("Start Date is required"),
    enddate: Yup.date()
      .typeError("End Date is required")
      .required("End Date is required"),
    // .when("startdate", (startdate) => {
    //   if (startdate) {
    //     return Yup.date()
    //       .min(startdate, "End Date must be after Start Date")
    //       .typeError("End Date is required");
    //   }
    // }),
    approximatedate: Yup.string().required("This field is required."),
  });

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 relative">
        <div className="w-2/5 mb-20 flex items-center justify-center mt-36">
          <MainNavigationSteps currentStep={1} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
          <p className="text-xs">STEP 1 OF 3</p>
          <img
            className="mx-auto h-10 w-auto"
            src="/advus-banner-light.svg"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Select the dates of your trip
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Formik
            initialValues={{
              startdate: "",
              enddate: "",
              approximatedate: "",
              approxmiateduration: "",
            }}
            validationSchema={detailsSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(
                values.startdate,
                values.enddate,
                values.approximatedate,
                setSubmitting
              )
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
              <Form className="space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <Field
                      type="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      placeholder="Select date start"
                      name="startdate"
                    />
                  </div>
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <Field
                      type="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                      placeholder="Select date end"
                      name="enddate"
                    />
                  </div>
                </div>
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <Field
                      id="approximate"
                      aria-describedby="approximate"
                      name="approximate"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      checked={isApproxDate}
                      onChange={() => setIsApproxDate(!isApproxDate)}
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label
                      htmlFor="approximate"
                      className="font-medium text-gray-900"
                    >
                      These dates are approximate
                    </label>
                  </div>
                </div>
                {isApproxDate && (
                  <FormField
                    id="approxmiateduration"
                    name="approxmiateduration"
                    type="text"
                    fieldError={errors.approxmiateduration}
                    fieldTouched={touched.approxmiateduration}
                    textColor="text-black"
                  >
                    What is the desired duration of your trip (in days)?
                  </FormField>
                )}

                <div className="flex flex-row justify-end text-center items-center mt-3">
                  <Link href="/details/2">
                    <Btn buttonType="primary" type="submit">
                      Next
                    </Btn>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
