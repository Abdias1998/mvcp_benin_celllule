import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOne(properties: string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          const object = args.object as any;
          
          // Vérifier si au moins une des propriétés a une valeur
          return relatedProperties.some((prop: string) => {
            const val = object[prop];
            return val !== undefined && val !== null && val !== '';
          });
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedProperties] = args.constraints;
          return `Au moins un des champs suivants doit être fourni: ${relatedProperties.join(', ')}`;
        },
      },
    });
  };
}
