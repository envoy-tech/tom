import { CheckIcon } from "@heroicons/react/20/solid";

const steps = [
  { name: "Provide Trip Details", href: "#" },
  { name: "Add Travelers", href: "#" },
  { name: "Create your Itinerary", href: "#" },
  { name: "Finalize your Itinerary", href: "#" },
  { name: "Optimize", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type MainNavigationStepProps = {
  currentStep: number;
};

export default function MainNavigationSteps(props: MainNavigationStepProps) {
  const { currentStep } = props;

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            {currentStep > stepIdx + 1 ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <a
                  href="#"
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full bg-indigo-600 hover:bg-indigo-900"
                >
                  <span className="text-white mt-1 text-sm" aria-hidden="true">
                    {stepIdx + 1}
                  </span>
                  <span className="mt-2 text-center text-xs">{step.name}</span>
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
                  className="relative flex flex-col h-8 w-8 items-center justify-start rounded-full border-2 bg-indigo-600 border-indigo-600"
                  aria-current="step"
                >
                  <span className="text-white mt-1 text-sm" aria-hidden="true">
                    {stepIdx + 1}
                  </span>
                  <span className="mt-2 text-center text-xs">{step.name}</span>
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
                  className="group relative flex h-8 w-8 items-center justify-start rounded-full border-2 border-gray-300 bg-white hover:border-gray-400 flex-col"
                >
                  <span className="mt-1 text-sm" aria-hidden="true">
                    {stepIdx + 1}
                  </span>
                  <span className="mt-2 text-center text-xs">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
