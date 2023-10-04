import Link from "next/link";
export default function Footer() {
  return (
    <div className="absolute bottom-0 w-full flex flex-row justify-between space-x-6 pl-6 pr-6 pt-3 pb-3 bg-white">
      <Link className="ml-20 text-advus-lightblue-500 font-semibold" href="#">
        Privacy Policy
      </Link>
      <div className="">
        <Link href="#" className="justify-self-center">
          AdventurUs Travel, a product of Envoy Technology, Inc.
        </Link>
        <Link className="ml-10 mr-20" href="#">
          © 2023 Envoy Technology, Inc. All rights reserved.
        </Link>
      </div>
    </div>
  );
}
