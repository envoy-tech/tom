"use client";
import Steps from "@/components/page-components/Steps";
import { useState, useRef, SyntheticEvent } from "react";
import { useAppSelector } from "@/hooks/redux";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui-components/Spinner";
import OTPInput from "@/components/ui-components/OTPInput";
import Btn from "@/components/ui-components/Btn";

export default function RegisterStep1() {
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const email = useAppSelector((state) => state.user.email);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { push } = useRouter();
  const formRef = useRef(null);

  const handleConfirmation = async (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setVerificationMessage("");
    const response = await fetch("/api/auth/signUp", {
      method: "POST",
      body: JSON.stringify({ email, code: value }),
    });

    if (response.status === 200) {
      const data = await response.json();
      if (data.error) {
        setError(data.errorMessage);
      } else {
        push("/register/step/2");
      }
    } else {
      setError("An unexpected error has occured.");
    }

    setSubmitting(false);
  };

  // TODO: use message toasts instead of text
  const handleResendVerification = async () => {
    const response = await fetch("/api/auth/resendVerification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    if (response.status === 200) {
      setVerificationMessage("A new code has been sent to your email.");
      setError("");
    } else {
      setError("An unexpected error has occurred.");
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="/advus-banner-dark.svg"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-white">
          Email Verification
        </h2>
      </div>

      <form className="space-y-3" ref={formRef} onSubmit={handleConfirmation}>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col justify-center">
            <label className="block text-sm font-medium leading-6 text-white text-center mb-3">
              We have sent a code to your email at {email}. Please check your
              inbox and enter the verification code to verify your email address
            </label>
            <div className="flex flex-col mt-3 justify-center items-center">
              <OTPInput value={value} setValue={setValue} formRef={formRef} />
              {verificationMessage && (
                <label className="text-xs text-green-500 mt-1">
                  {verificationMessage}
                </label>
              )}
              {error && (
                <label className="text-xs text-red-500 mt-1">{error}</label>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center text-center items-center mt-3 space-y-3">
            <a
              className="no-underline text-sm font-semibold cursor-pointer text-white"
              onClick={handleResendVerification}
            >
              Resend verification code
            </a>
            <Btn buttonType="primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? <Spinner /> : "Next"}
            </Btn>
          </div>
        </div>
      </form>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Steps currentStep={1} numberOfSteps={4} />
      </div>
    </>
  );
}
