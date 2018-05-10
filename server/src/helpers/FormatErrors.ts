import { ValidationError } from "class-validator";

interface ErrorInterface {
  path: string;
  message: string;
}

const FormatErrors = (errors: ValidationError[]) =>
  errors.reduce((arr: ErrorInterface[], error) => {
    arr.push({
      path: error.property,
      message: Object.values(error.constraints)[0]
    });
    return arr;
  }, []);

export default FormatErrors;
