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

  const handleSubmitForm = (tripname: string, setSubmitting: Function) => {};

  const detailsSchema = Yup.object().shape({
    tripname: Yup.string()
      .typeError("Trip Name is required")
      .required("Trip Name is required"),
    approximatedate: Yup.string().required("This field is required."),
  });

  return (
    <>
      <div className="flex min-h-full w-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8 relative">
        <div className="w-2/5 mb-20 flex items-center justify-center mt-36">
          <MainNavigationSteps currentStep={1} />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center justify-center">
          <p className="text-xs">STEP 3 OF 3</p>
          <img
            className="mx-auto h-10 w-auto"
            src="/advus-banner-light.svg"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Give your trip a name
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <Formik
            initialValues={{
              tripname: "",
            }}
            validationSchema={detailsSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(values.tripname, setSubmitting)
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
              <Form>
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-grow flex-col">
                    <div>
                      <FormField
                        id="tripname"
                        name="tripname"
                        type="text"
                        fieldError={errors.tripname}
                        fieldTouched={touched.tripname}
                        textColor="text-black"
                      >
                        Name of your Trip
                      </FormField>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-between text-center items-center mt-6">
                  <Btn buttonType="secondary" type="submit" href="/details/2">
                    Back
                  </Btn>
                  <Btn buttonType="primary" type="submit" href="/travelers">
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
