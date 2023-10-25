export const RE_DIGIT = new RegExp(/^\d+$/);

type ErrorMap = {
  [index: string]: string;
};

export const ERROR_MAP: ErrorMap = {
  CodeMismatchException: "You have input the wrong verification code!",
  UsernameExistsException:
    "Your email has already been used for a separate account.",
  NotAuthorizedException: "You have input the wrong email or password.",
};
