"use client";
import { MutableRefObject, useMemo } from "react";
import { RE_DIGIT } from "@/utils/constants";

type OTPInputProps = {
  value: string;
  setValue: Function;
  formRef: MutableRefObject<null>;
};

export default function OTPInput(props: OTPInputProps) {
  const { value, setValue, formRef } = props;

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

  const inputOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const { clipboardData } = e;
    const pastedInput = clipboardData.getData("Text");
    setValue(pastedInput);
  };

  return (
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
            onPaste={inputOnPaste}
            value={digit}
            key={`otp-input-${idx}`}
          />
        </div>
      ))}
    </div>
  );
}
