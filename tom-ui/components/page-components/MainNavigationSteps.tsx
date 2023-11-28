import { CheckIcon } from "@heroicons/react/20/solid";

const steps = [
  { name: "Provide Trip Details", href: "#" },
  { name: "Add Travelers", href: "#" },
  { name: "Create your Itinerary", href: "#" },
  { name: "Finalize your Itinerary", href: "#" },
  { name: "Optimize", href: "#" },
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
                  href="#"
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full bg-advus-lightblue-500"
                >
                  <span
                    className="text-white mt-1.5 text-sm text-center"
                    aria-hidden="true"
                  >
                    {stepIdx + 1}
                  </span>
                  <span className="mt-3 text-center text-xs">{step.name}</span>
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
                  href="#"
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full border-2 bg-white border-advus-lightblue-500"
                  aria-current="step"
                >
                  <span
                    className="text-advus-lightblue-500 mt-1 text-sm"
                    aria-hidden="true"
                  >
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
                  href="#"
                  className="group relative flex h-8 w-8 items-center justify-start rounded-full bg-gray-300 flex-col"
                >
                  <span
                    className="mt-1.5 text-sm text-gray-800"
                    aria-hidden="true"
                  >
                    {stepIdx + 1}
                  </span>
                  <span className="mt-3 text-center text-xs">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
