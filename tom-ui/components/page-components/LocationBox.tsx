import { PlusIcon, TrashIcon } from "@heroicons/react/20/solid";

type LocationBoxProps = {
  added: boolean;
  locationName: string;
  locationAddress: string;
};

export default function LocationBox(props: LocationBoxProps) {
  const { added, locationName, locationAddress } = props;

  return (
    <div className="flex justify-between w-11/12 flex-row">
      <div className="flex justify-start items-start w-full flex-col">
        <h1 className="font-semibold text-xl">{locationName}</h1>
        <p className="mt-2">{locationAddress}</p>
      </div>
      <div
        className={`flex flex-row justify-center items-center ${
          added ? "text-advus-brown-500" : "text-advus-lightblue-500"
        }`}
      >
        {added ? (
          <TrashIcon
            className={`h-5 w-5 mr-2 ${
              added ? "text-advus-brown-500" : "text-advus-lightblue-500"
            }`}
          />
        ) : (
          <PlusIcon
            className={`h-5 w-5 mr-2 ${
              added ? "text-advus-brown-500" : "text-advus-lightblue-500"
            }`}
          />
        )}
        {added ? "Remove" : "Add"}
      </div>
    </div>
  );
}
