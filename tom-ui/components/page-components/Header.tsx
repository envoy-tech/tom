import Btn from "../ui-components/Btn";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import Link from "../ui-components/Link";

export default function Header() {
  return (
    <div className="h-15 w-full flex flex-row items-center justify-between pl-6 pr-6 pt-3 pb-3 bg-advus-navyblue-500">
      <img className="h-6" src="/advus-banner-dark.svg" alt="Your Company" />
      <div className="flex flex-row justify-center items-center space-x-6">
        <Link href="/home" linkType="primary">
          View all trips
        </Link>
        <Btn href="/details/1" buttonType="primary" type="button">
          Plan a trip
        </Btn>
        <Link linkType="primary" href="/home">
          <UserCircleIcon
            className="h-10 w-10 text-white cursor-pointer"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
