import Btn from "@/components/ui-components/Btn";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8 ">
      <div className="flex flex-row w-full justify-start items-center">
        <h1 className="text-4xl font-bold mr-3">All of my Trips</h1>
        <Btn href={"/details/1"} buttonType="primary" type="button">
          Plan a Trip
        </Btn>
      </div>
      <div className="flex flex-col justify-center items-start space-y-6 mt-6">
        <div className="border-red-300 border-2 h-64 w-64"></div>
        <div className="border-red-300 border-2 h-64 w-64"></div>
        <div className="border-red-300 border-2 h-64 w-64"></div>
      </div>
    </div>
  );
}
