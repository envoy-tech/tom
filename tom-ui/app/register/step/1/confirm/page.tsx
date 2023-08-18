"use client";
import Link from "next/link";
import Steps from "@/components/Steps";
import { useState, useMemo, useRef } from "react";
import { RE_DIGIT } from "@/utils/constants";
import { useAppSelector } from "@/hooks/redux";

export default function RegisterStep1() {
  const [value, setValue] = useState("");
  const email = useAppSelector((state) => state.email);
  const formRef = useRef(null);
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }
    return items;
  }, [value]);

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value;
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    const form = e.target.form;
    const index = Array.prototype.indexOf.call(form, e.target);
    const nextInputEl = form.elements[index + 1];

    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      setValue(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      if (form) {
        nextInputEl.focus();
        e.preventDefault();
      }
    } else if (targetValueLength === value.length) {
      setValue(targetValue);

      target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const targetValue = target.value;

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    const form = formRef.current;
    const index = Array.prototype.indexOf.call(form, e.target);

    if (form) {
      if (index > 0) {
        form.elements[index - 1].focus();
      }

      e.preventDefault();
    }
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    // keep focusing back until previous input
    // element has value
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    const form = formRef.current;
    const index = Array.prototype.indexOf.call(form, e.target);

    if (form) {
      if (index > 0 && form.elements[index - 1].value === "") {
        form.elements[index - 1].focus();
      }

      e.preventDefault();
    }

    target.setSelectionRange(0, target.value.length);
  };

  const handleConfirmation = async (e) => {
    const response = await fetch("/api/auth/signUp", {
      method: "POST",
      body: JSON.stringify({ email, code: value }),
    });

    const data = await response.json();

    console.log(data);
  };

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
            Email Verification
          </h2>
        </div>

        <form className="space-y-3" ref={formRef}>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="flex flex-col justify-center">
              <label className="block text-sm font-medium leading-6 text-gray-900 text-center">
                We have sent a code to your email.
              </label>
              <div className="flex flex-col space-y-16 mt-3">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {valueItems.map((digit, idx) => (
                    <div className="w-12 h-12" key={`otp-input-${idx}-group`}>
                      <input
                        className="w-full h-full flex flex-col items-center justify-center text-center px-3 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        name={`otp-input-${idx}`}
                        id={`otp-input-${idx}`}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="\d{1}"
                        maxLength={1}
                        onChange={(e) => inputOnChange(e, idx)}
                        onKeyDown={inputOnKeyDown}
                        onFocus={inputOnFocus}
                        value={digit}
                        key={`otp-input-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center text-center items-center mt-3">
              <Link href="/register/step/2">
                <button
                  className="flex w-32 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleConfirmation}
                >
                  Next
                </button>
              </Link>
            </div>
          </div>
        </form>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Steps currentStep={1} numberOfSteps={4} />
        </div>
      </div>
    </>
  );
}
