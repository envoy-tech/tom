type StepProps = {
  currentStep: number;
  numberOfSteps: number;
};

export default function Steps(props: StepProps) {
  const { currentStep, numberOfSteps } = props;

  return (
    <nav className="flex items-center justify-center" aria-label="Progress">
      <ol role="list" className="flex items-center space-x-5">
        {[...Array(numberOfSteps)].map((step, index) => (
          <li key={`step-${index}`}>
            {currentStep > index + 1 ? (
              <div className="block h-5 w-5 rounded-full bg-advus-lightblue-500">
                <span className="sr-only">Step {index}</span>
              </div>
            ) : currentStep === index + 1 ? (
              <div
                className="relative flex items-center justify-center"
                aria-current="step"
              >
                <span
                  className="relative block h-5 w-5 rounded-full bg-advus-lightblue-500"
                  aria-hidden="true"
                />
                <span className="sr-only">Step {index}</span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span className="h-full w-full rounded-full bg-advus-lightblue-500" />
                </span>
                <span
                  className="relative block h-3.5 w-3.5 rounded-full bg-white"
                  aria-hidden="true"
                />
                <span className="sr-only">Step {index}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
