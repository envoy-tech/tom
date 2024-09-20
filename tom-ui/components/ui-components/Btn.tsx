"use client";
import Link from "next/link";
import { PropsWithChildren, MouseEventHandler } from "react";

type BtnProps = {
  onClickHandler?: MouseEventHandler<HTMLElement>;
  href?: string;
  buttonType: "primary" | "secondary";
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  length?: "default" | "long" | "short" | undefined;
};

export default function Btn(props: PropsWithChildren<BtnProps>) {
  const { onClickHandler, href, buttonType, type, disabled, length, children } =
    props;

  let typeStyling;
  let lengthStyling;

  switch (buttonType) {
    case "primary":
      typeStyling =
        "bg-advus-lightblue-500 text-white outline-advus-lightblue-500 hover:bg-white hover:outline-advus-navyblue-500 hover:text-advus-navyblue-500 active:text-white active:bg-advus-navyblue-500";
      break;
    case "secondary":
      typeStyling =
        "text-advus-lightblue-500 outline-advus-lightblue-500 hover:bg-advus-lightblue-100 hover:outline-advus-lightblue-500 hover:text-advus-navyblue-500 active:outline-advus-lightblue-500 active:text-advus-navyblue-500 active:bg-advus-lightblue-300";
      break;
    default:
      typeStyling =
        "bg-advus-lightblue-500 text-white outline-advus-lightblue-500 hover:bg-white hover:outline-advus-navyblue-500 hover:text-advus-navyblue-500 active:text-white active:bg-advus-navyblue-500";
      break;
  }

  switch (length) {
    case "long":
      lengthStyling = "w-56";
      break;
    case "short":
      lengthStyling = "w-24";
      break;
    default:
      lengthStyling = "w-32";
  }

  const btnComponent = (
    <button
      className={`flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm outline disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500 disabled:outline-none outline-2 transition-all select-none ${typeStyling} ${lengthStyling}`}
      onClick={onClickHandler}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );

  return <>{href ? <Link href={href}>{btnComponent}</Link> : btnComponent}</>;
}
