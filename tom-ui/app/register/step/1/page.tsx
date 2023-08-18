"use client";
import Link from "next/link";
import Steps from "@/components/Steps";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { signIn } from "next-auth/react";
import { setEmail } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/hooks/redux";
YupPassword(Yup);

export default function RegisterStep1() {
  const dispatch = useAppDispatch();

  const handleSubmitForm = async (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    setSubmitting: Function
  ) => {
    setSubmitting(true);
    dispatch(setEmail(email));
    const request = await signIn(
      "credentials",
      {
        name: `${firstname} ${lastname}`,
        email,
        password,
        callbackUrl: "/register/step/1/confirm",
      },
      { newUser: "true" }
    );
  };

  const registerSchema = Yup.object().shape({
    firstname: Yup.string().required("This field is required.").max(255),
    lastname: Yup.string().required("This field is required.").max(255),
    email: Yup.string().email().required("This field is required."),
    password: Yup.string()
      .required("This field is required.")
      .min(8)
      .max(99)
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
    confirmpassword: Yup.string()
      .required("This field is required.")
      .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  });

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
            Let's start your adventure!
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              email: "",
              password: "",
              confirmpassword: "",
            }}
            validationSchema={registerSchema}
            onSubmit={(values, { setSubmitting }) =>
              handleSubmitForm(
                values.firstname,
                values.lastname,
                values.email,
                values.password,
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
                <div className="flex flex-row">
                  <div className="flex flex-col flex-grow mr-3">
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      First Name
                    </label>
                    <div className="mt-2">
                      <Field
                        id="firstname"
                        name="firstname"
                        type="text"
                        autoComplete="firstname"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.firstname && touched.firstname ? (
                      <label className="text-xs text-red-500 mt-1">
                        {errors.firstname}
                      </label>
                    ) : null}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Last Name
                    </label>
                    <div className="mt-2">
                      <Field
                        id="lastname"
                        name="lastname"
                        type="text"
                        autoComplete="lastname"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.lastname && touched.lastname ? (
                      <label className="text-xs text-red-500 mt-1">
                        {errors.lastname}
                      </label>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <label className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </label>
                  ) : null}
                </div>

                <div className="flex flex-row">
                  <div className="flex flex-col flex-grow mr-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.password && touched.password ? (
                      <label className="text-xs text-red-500 mt-1">
                        {errors.password}
                      </label>
                    ) : null}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor="confirmpassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="confirmpassword"
                        name="confirmpassword"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    {errors.confirmpassword && touched.confirmpassword ? (
                      <label className="text-xs text-red-500 mt-1">
                        {errors.confirmpassword}
                      </label>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-row justify-between text-center items-center mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link href="/signin" className="underline font-bold">
                      Log in
                    </Link>
                  </p>
                  <Link href="/register/step/2">
                    <button
                      type="submit"
                      className="flex w-32 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={handleSubmit}
                    >
                      Next
                    </button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={1} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
