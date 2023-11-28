import MainNavigationSteps from "./MainNavigationSteps";
import { MapIcon } from "@heroicons/react/24/outline";
import { ListBulletIcon } from "@heroicons/react/20/solid";
import { DUMMY_LOCATION_DATA } from "@/utils/dummy-data";
import ListViewLocation from "../ui-components/ListViewLocation";
import Btn from "../ui-components/Btn";

type ListViewProps = {
  showMapView: Function;
};

export default function ListView(props: ListViewProps) {
  const { showMapView } = props;

  return (
    <div className="flex min-h-full w-full flex-1 flex-col justify-start items-center px-6 py-6 lg:px-8 relative">
      <div className="w-2/5 mb-20 flex items-center justify-center mt-6">
        <MainNavigationSteps currentStep={4} />
      </div>
      <div className="w-5/6 flex flex-col">
        <div className="flex flex-row justify-between items-start">
          <div className="w-1/2">
            <h1 className="text-2xl font-semibold">
              Finalize your trip by adding your preferences
            </h1>
            <p className="text-sm">
              Below, rate and indicate how much time you would like to spend at
              each of the locations added to your itinerary.
            </p>
          </div>

          <div className="flex flex-row border-advus-lightblue-500 border-2 rounded-md px-3 py-1.5 space-x-3">
            <div
              className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 text-gray-500 hover:cursor-pointer hover:text-advus-navyblue-500"
              onClick={() => showMapView(true)}
            >
              <MapIcon className="h-6 w-6" />
              <p>Map View</p>
            </div>
            <div
              className="flex flex-row items-center justify-center font-semibold text-xs space-x-2 text-advus-lightblue-500 hover:cursor-pointer hover:text-advus-navyblue-500"
              onClick={() => showMapView(false)}
            >
              <ListBulletIcon className="h-6 w-6" />
              <p>List View</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col justify-center items-center">
            <p className="text-sm">Time remaining to allocate</p>
            <p className="text-md text-advus-lightblue-500">
              3 days 2 hrs 45 min
            </p>
          </div>
        </div>
        <div className="overflow-y-scroll max-h-72 space-y-4 pr-3">
          {DUMMY_LOCATION_DATA.map((location, index) => (
            <div className="space-y-3" key={`location-${index}`}>
              <ListViewLocation
                name={location.name}
                address={location.address}
              />
              {index !== DUMMY_LOCATION_DATA.length - 1 && (
                <div className="border-gray-400 border-b-2 w-full"></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between text-center items-center mt-6">
          <Btn
            buttonType="secondary"
            type="submit"
            href="/itinerary/2"
            length="long"
          >
            Back
          </Btn>
          <Btn
            buttonType="primary"
            type="submit"
            href="/optimize"
            length="long"
          >
            Next
          </Btn>
        </div>
      </div>
    </div>
  );
}
