"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Steps from "@/components/page-components/Steps";
import Spinner from "@/components/ui-components/Spinner";
import Btn from "@/components/ui-components/Btn";
import FormField from "@/components/ui-components/FormField";
import { useState } from "react";
import { ERROR_MAP } from "@/utils/constants";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { signIn } from "next-auth/react";
import { setEmail } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/hooks/redux";
YupPassword(Yup);

export default function RegisterStep1() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [registerError, setRegisterError] = useState("");

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
        redirect: false,
      },
      { newUser: "true" }
    );

    if (request && request.error) {
      setRegisterError(ERROR_MAP[request.error]);
    } else if (request && request.status === 200 && !request.error) {
      router.push("/register/step/1/confirm");
    }

    setSubmitting(false);
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
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/advus-banner-dark.svg"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-white">
          Let's start your adventure!
        </h2>
        <p className="text-white text-sm text-center">
          Create an account to begin planning your first trip
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
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
            <Form className="space-y-3" onSubmit={handleSubmit}>
              <div className="flex flex-row">
                <div className="flex flex-col flex-grow mr-3">
                  <FormField
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoComplete="firstname"
                    textColor="text-white"
                    fieldError={errors.firstname}
                    fieldTouched={touched.firstname}
                  >
                    First Name
                  </FormField>
                </div>
                <div className="flex flex-col flex-grow">
                  <FormField
                    id="lastname"
                    name="lastname"
                    type="text"
                    autoComplete="lastname"
                    textColor="text-white"
                    fieldError={errors.lastname}
                    fieldTouched={touched.lastname}
                  >
                    Last Name
                  </FormField>
                </div>
              </div>

              <div>
                <FormField
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  textColor="text-white"
                  fieldError={errors.email}
                  fieldTouched={touched.email}
                >
                  Email Address
                </FormField>
              </div>

              <div className="flex flex-row">
                <div className="flex flex-col flex-grow mr-3">
                  <FormField
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    textColor="text-white"
                    fieldError={errors.password}
                    fieldTouched={touched.password}
                  >
                    Password
                  </FormField>
                </div>
                <div className="flex flex-col flex-grow">
                  <FormField
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="current-password"
                    textColor="text-white"
                    fieldError={errors.confirmpassword}
                    fieldTouched={touched.confirmpassword}
                  >
                    Confirm Password
                  </FormField>
                </div>
              </div>

              <div className="flex flex-row justify-between text-center items-center mt-3">
                <p className="text-white">
                  Already have an account?{" "}
                  <Link href="/signin" className="no-underline font-semibold">
                    Log in
                  </Link>
                </p>
                <Btn type="submit" buttonType="primary" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : "Next"}
                </Btn>
              </div>
              {registerError && (
                <label className="text-xs text-red-500 mt-1 self-center">
                  {registerError}
                </label>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <div className="mt-20">
        <Steps currentStep={1} numberOfSteps={4} />
      </div>
    </>
  );
}
