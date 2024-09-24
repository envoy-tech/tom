import { CheckIcon } from "@heroicons/react/20/solid";

const steps = [
  { name: "Provide Trip Details", href: "/details/1" },
  { name: "Add Travelers", href: "/travelers" },
  { name: "Create your Itinerary", href: "/itinerary/1" },
  { name: "Finalize your Itinerary", href: "/finalize" },
  { name: "Optimize", href: "/optimize" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

type MainNavigationStepProps = {
  currentStep: number;
};

export default function MainNavigationSteps(props: MainNavigationStepProps) {
  const { currentStep } = props;

  return (
    <nav
      aria-label="Progress"
      className="w-full flex items-center justify-center"
    >
      <ol role="list" className="flex items-center w-full justify-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 w-full" : "",
              "relative"
            )}
          >
            {currentStep > stepIdx + 1 ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-advus-lightblue-500" />
                </div>
                <a
                  href={step.href}
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full bg-advus-lightblue-500 hover:border-advus-navyblue-500 hover:bg-advus-navyblue-500 hover:text-white transition-color"
                >
                  <span
                    className="text-white mt-1.5 text-sm text-center"
                    aria-hidden="true"
                  >
                    {stepIdx + 1}
                  </span>
                  <span className="mt-3 text-center text-xs text-black">
                    {step.name}
                  </span>
                </a>
              </>
            ) : currentStep === stepIdx + 1 ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href={step.href}
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full border-2 bg-white border-advus-lightblue-500 text-advus-lightblue-500 hover:border-advus-navyblue-500 hover:bg-advus-navyblue-500 hover:text-white transition-colors"
                  aria-current="step"
                >
                  <span className="mt-1 text-sm" aria-hidden="true">
                    {stepIdx + 1}
                  </span>
                  <span className="mt-3 text-center text-xs text-advus-lightblue-500">
                    {step.name}
                  </span>
                </a>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href={step.href}
                  className="group relative flex h-8 w-8 items-center justify-start rounded-full bg-gray-300 flex-col hover:border-advus-navyblue-500 hover:bg-advus-navyblue-500 hover:text-white transition-color text-gray-800"
                >
                  <span className="mt-1.5 text-sm" aria-hidden="true">
                    {stepIdx + 1}
                  </span>
                  <span className="mt-3 text-center text-xs text-gray-800">
                    {step.name}
                  </span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
