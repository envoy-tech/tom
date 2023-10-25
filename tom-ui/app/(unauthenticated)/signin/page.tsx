"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Formik, Form, Field } from "formik";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, Suspense } from "react";
import Btn from "@/components/ui-components/Btn";
import Spinner from "@/components/ui-components/Spinner";
import Link from "@/components/ui-components/Link";
import * as Yup from "yup";

export default function SignIn() {
  const [fromSignupFlow, setFromSignupFlow] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required("This field is required."),
    password: Yup.string().required("This field is required."),
  });

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    const request = await signIn(
      "credentials",
      {
        email,
        password,
        callbackUrl: "http://localhost:3000/",
        redirect: false,
      },
      { newUser: "false" }
    );

    if (request && request.error) {
      setAuthError(request.error);
    } else {
      push("/home");
    }
    setLoading(false);
  };

  useMemo(() => {
    if (searchParams.get("fromSignupFlow")) {
      setFromSignupFlow(true);
    }
  }, [searchParams]);

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-advus-navyblue-500">
        <img
          className="absolute h-3/4 bottom-0 right-52 opacity-5 z-0"
          src="/advus-emblem-white.svg"
        />
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="/advus-banner.svg"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-semi leading-9 tracking-tight text-white"></h2>
          <p className=" text-center text-sm font-semi leading-9 tracking-tight text-white">
            Welcome to AdventurUs,{" "}
            {fromSignupFlow
              ? "first, let's get you logged in."
              : "sign in to your account."}
          </p>
        </div>

        <div className="mt-3 sm:mx-auto sm:w-full sm:max-w-sm z-10">
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
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.email && touched.email && "ring-advus-red-500"
                      }`}
                    />
                  </div>
                  {errors.email && touched.email ? (
                    <label className="text-xs text-advus-red-500 mt-1">
                      {errors.email}
                    </label>
                  ) : null}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className={`block w-full rounded-md border-0 py-1.5 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                        errors.password &&
                        touched.password &&
                        "ring-advus-red-500"
                      }`}
                    />
                  </div>
                  {errors.password && touched.password ? (
                    <label className="text-xs text-advus-red-500 mt-1">
                      {errors.password}
                    </label>
                  ) : null}
                </div>
                <div className="text-sm">
                  <Link href="#" linkType="primary">
                    Forgot password?
                  </Link>
                </div>

                <div className="flex flex-col items-center">
                  <Btn type="submit" buttonType="primary">
                    {loading ? <Spinner></Spinner> : "Sign in"}
                  </Btn>
                  {authError && (
                    <label className="text-xs text-advus-red-500 mt-1">
                      {authError}
                    </label>
                  )}
                </div>
              </Form>
            )}
          </Formik>

          <div className="w-full flex justify-center items-center mt-4">
            <Link href="register/step/1" linkType="primary">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
