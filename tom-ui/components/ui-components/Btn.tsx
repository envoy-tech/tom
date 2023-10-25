"use client";
import Link from "next/link";
import { PropsWithChildren, MouseEventHandler } from "react";

type BtnProps = {
  onClickHandler?: MouseEventHandler<HTMLElement>;
  href?: string;
  buttonType: "primary" | "secondary";
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
};

export default function Btn(props: PropsWithChildren<BtnProps>) {
  const { onClickHandler, href, buttonType, type, disabled, children } = props;

  let typeStyling;

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

  const btnComponent = (
    <button
      className={`flex w-32 justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm outline outline-2 transition-all ${typeStyling}`}
      onClick={onClickHandler}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );

  return <>{href ? <Link href={href}>{btnComponent}</Link> : btnComponent}</>;
}
