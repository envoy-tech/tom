import Link from "next/link";

type FooterProps = {
  mode: "light" | "dark";
};

export default function Footer(props: FooterProps) {
  const { mode } = props;
  return (
    <div
      className={`h-15 w-full flex flex-row items-center justify-between space-x-6 pl-6 pr-6 pt-3 pb-3 mt-auto ${
        mode === "light" ? "bg-white" : "bg-advus-navyblue-500"
      }`}
    >
      <Link
        className={`ml-20 lg:ml-10 text-sm ${
          mode === "light" ? "text-advus-lightblue-500" : "text-white"
        } font-semibold`}
        href="#"
      >
        Privacy Policy
      </Link>
      <div className="">
        <Link
          href="#"
          className={`justify-self-center text-sm ${
            mode === "light" ? "text-black" : "text-white"
          }`}
        >
          AdventurUs Travel, a product of Envoy Technology, Inc.
        </Link>
        <Link
          className={`ml-10 mr-20 lg:mr-10 text-sm ${
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
