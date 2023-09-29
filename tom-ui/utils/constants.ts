export const RE_DIGIT = new RegExp(/^\d+$/);

export const ERROR_MAP = {
  CodeMismatchException: "You have input the wrong verification code!",
  UsernameExistsException:
    "Your email has already been used for a separate account.",
  NotAuthorizedException: "You have input the wrong email or password.",
};
