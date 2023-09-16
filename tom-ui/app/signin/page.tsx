"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import { useSearchParams } from "next/navigation";
import * as Yup from "yup";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function SignIn() {
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState("");

  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required("This field is required."),
    password: Yup.string().required("This field is required."),
  });

  const handleSignIn = async (email: string, password: string) => {
    const request = await signIn(
      "credentials",
      {
        email,
        password,
        callbackUrl: "http://localhost:3000/",
      },
      { newUser: "false" }
    );

    console.log(request);
  };

  useMemo(() => {
    if (searchParams.get("error")) {
      console.log(searchParams.get("error"));
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
            onSubmit={(values) => handleSignIn(values.email, values.password)}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <label className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </label>
                  ) : null}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.password && touched.password ? (
                    <label className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </label>
                  ) : null}
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="w-full flex justify-center items-center mt-4">
            <Link href="register/step/1" className="underline font-bold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
