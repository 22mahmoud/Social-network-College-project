import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import User from "../modules/User/User.entity";

@ValidatorConstraint({ async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
  validate(email: string, parent) {
    return User.findOne({ email }).then(user => {
      if (user) {
        if (user.id === parent.object.id) {
          return true;
        }
        return false;
      }
      return true;
    });
  }
}

export function Unique(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueConstraint
    });
  };
}
