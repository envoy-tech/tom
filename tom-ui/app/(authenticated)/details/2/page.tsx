"use client";
import Link from "next/link";
import MainNavigationSteps from "@/components/page-components/MainNavigationSteps";
import Btn from "@/components/ui-components/Btn";
import FormField from "@/components/ui-components/FormField";
import { Form, Formik } from "formik";
import { useRef } from "react";
import * as Yup from "yup";

export default function DetailsPageStepOne() {
  const formRef = useRef(null);

  const handleSubmitForm = (
    startdate: string,
    enddate: string,
    setSubmitting: Function
  ) => {};

  const detailsSchema = Yup.object().shape({
    startlocation: Yup.string()
      .typeError("Start Location is required")
      .required("Start Location is required"),
    endlocation: Yup.string()
      .typeError("End Location is required")
      .required("End Location is required"),
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative">
        <div className="w-100 mb-20 flex items-center justify-center">
          <MainNavigationSteps currentStep={1} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
          <p className="text-xs">STEP 2 OF 3</p>
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Tell us the starting and ending points of your trip
          </h2>
          <p className="text-xs mt-3 text-center">
            At minimum, please provide the city and state. But if you have more
            location details, the more specific you are, the better!
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Formik
            initialValues={{
              startlocation: "",
              endlocation: "",
            }}
            validationSchema={detailsSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(
                values.startlocation,
                values.endlocation,
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
                  <div className="flex flex-grow flex-col">
                    <div>
                      <FormField
                        id="startlocation"
                        name="startlocation"
                        type="text"
                        fieldError={errors.startlocation}
                        fieldTouched={touched.startlocation}
                        textColor="text-black"
                      >
                        Starting location (minimum: City, State)
                      </FormField>
                    </div>
                    <div className="mt-6">
                      <FormField
                        id="endlocation"
                        name="endlocation"
                        type="text"
                        fieldError={errors.endlocation}
                        fieldTouched={touched.endlocation}
                        textColor="text-black"
                      >
                        Ending location (minimum: City, State)
                      </FormField>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between text-center items-center mt-3">
                  <Btn buttonType="secondary" type="submit" href="/details/1">
                    Back
                  </Btn>
                  <Btn buttonType="primary" type="submit" href="/details/3">
                    Next
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
