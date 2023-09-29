import Btn from "../ui-components/Btn";
import { UserCircleIcon } from "@heroicons/react/20/solid";

export default function Header() {
  return (
    <div className="w-full flex flex-row justify-between pl-6 pr-6 pt-3 pb-3 bg-gray-300">
      <div>Image here</div>
      <div className="flex flex-row justify-center items-center space-x-6">
        <Btn href="/home" buttonType="primary" type="button">
          View all trips
        </Btn>
        <Btn href="/details/1" buttonType="primary" type="button">
          Plan a trip
        </Btn>
        <UserCircleIcon
          className="h-10 w-10 text-gray-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
