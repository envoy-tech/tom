"use client";
import { Field } from "formik";
import { PropsWithChildren } from "react";

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
      <div className="mt-2">
        <Field
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          className={`block w-full rounded-md border-0 px-3 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-advus-lightblue-500 sm:text-sm sm:leading-6 ${
            fieldError && fieldTouched && "ring-red-500"
          }`}
        />
      </div>
      {fieldError && fieldTouched && (
        <label className="text-xs text-red-500 mt-1">{fieldError}</label>
      )}
    </>
  );
}
