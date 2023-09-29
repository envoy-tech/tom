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
                    <FormField
                      labelText="First Name"
                      id="firstname"
                      name="firstname"
                      type="text"
                      autoComplete="firstname"
                      fieldError={errors.firstname}
                      fieldTouched={touched.firstname}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <FormField
                      labelText="Last Name"
                      id="lastname"
                      name="lastname"
                      type="text"
                      autoComplete="lastname"
                      fieldError={errors.lastname}
                      fieldTouched={touched.lastname}
                    />
                  </div>
                </div>

                <div>
                  <FormField
                    labelText="Email Address"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    fieldError={errors.email}
                    fieldTouched={touched.email}
                  />
                </div>

                <div className="flex flex-row">
                  <div className="flex flex-col flex-grow mr-3">
                    <FormField
                      labelText="Password"
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="password"
                      fieldError={errors.password}
                      fieldTouched={touched.password}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <FormField
                      labelText="Confirm Password"
                      id="confirmpassword"
                      name="confirmpassword"
                      type="password"
                      autoComplete="current-password"
                      fieldError={errors.confirmpassword}
                      fieldTouched={touched.confirmpassword}
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between text-center items-center mt-3">
                  <p>
                    Already have an account?{" "}
                    <Link href="/signin" className="underline font-bold">
                      Log in
                    </Link>
                  </p>
                  <Btn
                    type="submit"
                    buttonType="primary"
                    onClickHandler={handleSubmit}
                    disabled={isSubmitting}
                  >
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
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={1} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
