import { XMarkIcon } from "@heroicons/react/20/solid";

type LocationListViewBoxProps = {
  locationName: string;
  locationAddress: string;
  index: number;
};

export default function LocationListViewBox(props: LocationListViewBoxProps) {
  const { locationName, locationAddress, index } = props;

  return (
    <div className="flex justify-between w-full flex-row">
      <div className="flex flex-row justify-center items-center w-full h-full space-x-6">
        <h1 className="text-center text-xl font-semibold text-advus-lightblue-500">
          {index}
        </h1>
        <div className="flex justify-start items-start w-full flex-col">
          <h1 className="font-semibold text-xl">{locationName}</h1>
          <p className="mt-2">{locationAddress}</p>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center text-advus-brown-500">
        <XMarkIcon className="h-5 w-5 mr-2" />
      </div>
    </div>
  );
}
