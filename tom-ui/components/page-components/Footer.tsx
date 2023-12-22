import Link from "next/link";

type FooterProps = {
  mode: "light" | "dark";
};

export default function Footer(props: FooterProps) {
  const { mode } = props;
  return (
    <div
      className={`h-15 w-full flex flex-row items-center justify-between space-x-6 px-6 pt-3 pb-3 md:space-x-3 md:px-4 mt-auto ${
        mode === "light" ? "bg-white" : "bg-advus-navyblue-500"
      }`}
    >
      <Link
        className={`ml-20 md:ml-0 md:text-xs lg:ml-10 text-sm ${
          mode === "light" ? "text-advus-lightblue-500" : "text-white"
        } font-semibold`}
        href="#"
      >
        Privacy Policy
      </Link>
      <div className="flex justify-center items-center">
        <Link
          href="#"
          className={`justify-self-center md:text-xs text-sm ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          AdventurUs Travel, a product of Envoy Technology, Inc.
        </Link>
        <Link
          className={`ml-10 mr-20 md:mr-0 md:text-2xs lg:mr-10 text-sm ${
            mode === "light" ? "text-black" : "text-white"
          }`}
          href="#"
        >
          © 2023 Envoy Technology, Inc. All rights reserved.
        </Link>
      </div>
    </div>
  );
}
