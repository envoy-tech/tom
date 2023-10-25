"use client";

import NextLink from "next/link";
import { PropsWithChildren, MouseEventHandler } from "react";

type LinkProps = {
  href: string;
  linkType: "primary" | "secondary" | "tertiary";
  onClick?: MouseEventHandler;
};

export default function Link(props: PropsWithChildren<LinkProps>) {
  const { href, linkType, children, onClick } = props;

  let typeStyling;

  switch (linkType) {
    case "primary":
      typeStyling =
        "text-white no-underline hover:underline active:no-underline";
      break;
    case "secondary":
      typeStyling =
        "text-advus-lightblue-500 no-underline hover:underline active:text-advus-navyblue-500 active:no-underline";
      break;
    case "tertiary":
      typeStyling =
        "text-advus-brown-500 no-underline hover:underline active:text-advus-navyblue-500 active:no-underline";
      break;
    default:
      typeStyling =
        "text-white no-underline hover:underline active:no-underline";
  }

  return (
    <NextLink
      href={href}
      className={typeStyling}
      onClick={onClick ? onClick : undefined}
    >
      {children}
    </NextLink>
  );
}
