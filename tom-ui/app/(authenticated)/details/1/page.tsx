"use client";
import Spinner from "@/components/ui-components/Spinner";
import FormField from "@/components/ui-components/FormField";
import Btn from "@/components/ui-components/Btn";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  setStartDate,
  setEndDate,
  setApproximateDuration,
} from "@/redux/slices/tripSlice";

export default function DetailsPageStepOne() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isApproxDate, setIsApproxDate] = useState(false);
  const { startDate, endDate, approximateDuration } = useAppSelector(
    (state) => state.trip
  );

  const handleSubmitForm = async (
    values: { startdate: string; enddate: string; approximateduration: number },
    setSubmitting: Function,
    validateForm: Function
  ) => {
    setSubmitting(true);
    dispatch(setStartDate(values.startdate));
    dispatch(setEndDate(values.enddate));
    dispatch(setApproximateDuration(values.approximateduration));
    router.push("/details/2");
    setSubmitting(false);
  };

  const detailsSchema = Yup.object().shape({
    startdate: Yup.date()
      .typeError("Start Date is invalid.")
      .required("Start Date is required."),
    enddate: Yup.date()
      .typeError("End Date is invalid.")
      .required("End Date is required.")
      .when(
        "startdate",
        (startdate, schema) =>
          startdate &&
          startdate[0] &&
          schema.min(startdate, "The end date is invalid.")
      ),
    approximate: Yup.boolean().notRequired(),
    approximateduration: Yup.number().required("This field is required."),
  });

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 relative">
        <div className="w-2/5 mb-20 flex items-center justify-center mt-6">
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
              startdate: startDate ?? "",
              enddate: endDate ?? "",
              approximateduration: approximateDuration ?? 0,
            }}
            validationSchema={detailsSchema}
            onSubmit={(values, { setSubmitting, validateForm }) =>
              handleSubmitForm(values, setSubmitting, validateForm)
            }
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              submitForm,
              setValues,
              /* and other goodies */
            }) => (
              <Form className="space-y-3">
                <div className="flex flex-row justify-between items-start space-x-6">
                  <div className="flex flex-col flex-grow">
                    <div className="relative">
                      <Field
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-advus-lightblue-500 focus:border-advus-lightblue-500 block w-full pl-5 p-2.5"
                        placeholder="Select date start"
                        name="startdate"
                      />
                      {errors.startdate && touched.startdate && (
                        <label className="text-xs text-advus-red-500 mt-1">
                          {errors.startdate}
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="relative">
                      <Field
                        type="date"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-advus-lightblue-500 focus:border-advus-lightblue-500 block w-full pl-5 p-2.5"
                        placeholder="Select date end"
                        name="enddate"
                      />
                      {errors.enddate && touched.enddate && (
                        <label className="text-xs text-advus-red-500 mt-1">
                          {errors.enddate}
                        </label>
                      )}
                    </div>
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
                      onChange={() => {
                        if (isApproxDate) {
                          setValues({
                            startdate: values.startdate,
                            enddate: values.enddate,
                            approximateduration: 0,
                          });
                        }
                        setIsApproxDate(!isApproxDate);
                      }}
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
                    id="approximateduration"
                    name="approximateduration"
                    type="text"
                    fieldError={errors.approximateduration}
                    fieldTouched={touched.approximateduration}
                    textColor="text-black"
                  >
                    What is the desired duration of your trip (in days)?
                  </FormField>
                )}

                <div className="flex flex-row justify-end text-center items-center mt-3">
                  <Btn
                    buttonType="primary"
                    type="submit"
                    onClickHandler={submitForm}
                  >
                    {isSubmitting ? <Spinner /> : "Next"}
                  </Btn>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
