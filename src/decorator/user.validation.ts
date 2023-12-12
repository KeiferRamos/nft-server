import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    if (args.property === 'registrationId') {
      return 'incorrect registration id';
    }
    return 'password does not match';
  }
}

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Invalid Date',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return (
            typeof value === 'string' &&
            regex.test(value) &&
            new Date(value).getTime() < new Date().getTime()
          );
        },
      },
    });
  };
}

export function IsValidGender(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Invalid Gender',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return ['male', 'female', 'gay'].includes(value.toLowerCase());
        },
      },
    });
  };
}

export function ValidateAdmin(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: Object, propertyName) => {
    registerDecorator({
      name: 'isValidAdmin',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: {
        message: 'Invalid Admin Pass',
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return process.env.ADMIN_PASS === value;
        },
      },
    });
  };
}
