"use client";
import { Field } from "formik";
import { PropsWithChildren } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

type FormFieldProps = {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  textColor: string;
  fieldError: string | undefined;
  fieldTouched: boolean | undefined;
};

export default function FormField(props: PropsWithChildren<FormFieldProps>) {
  const {
    id,
    name,
    type,
    autoComplete,
    fieldError,
    fieldTouched,
    children,
    textColor,
  } = props;

  return (
    <>
      <label
        htmlFor={name}
        className={`block text-sm font-medium leading-6 ${textColor}`}
      >
        {children}
      </label>
      <div className="mt-2 relative">
        <Field
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className={`block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-sm sm:leading-6 ${
            fieldError && fieldTouched && "ring-advus-red-500"
          }`}
        />
        {fieldError && fieldTouched && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-advus-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {fieldError && fieldTouched && (
        <label className="text-xs text-advus-red-500 mt-1">{fieldError}</label>
      )}
    </>
  );
}
