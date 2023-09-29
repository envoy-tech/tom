"use client";

type StepProps = {
  currentStep: number;
  numberOfSteps: number;
};

export default function Steps(props: StepProps) {
  const { currentStep, numberOfSteps } = props;

  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <ol role="list" className="ml-8 flex items-center space-x-5">
        {[...Array(numberOfSteps)].map((step, index) => (
          <li key={`step-${index}`}>
            {currentStep > index + 1 ? (
              <div className="block h-2.5 w-2.5 rounded-full bg-indigo-600 hover:bg-indigo-900">
                <span className="sr-only">Step {index}</span>
              </div>
            ) : currentStep === index + 1 ? (
              <div
                className="relative flex items-center justify-center"
                aria-current="step"
              >
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-indigo-200" />
                </span>
                <span
                  className="relative block h-2.5 w-2.5 rounded-full bg-indigo-600"
                  aria-hidden="true"
                />
                <span className="sr-only">Step {index}</span>
              </div>
            ) : (
              <div className="block h-2.5 w-2.5 rounded-full bg-gray-200 hover:bg-gray-400">
                <span className="sr-only">Step {index}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
