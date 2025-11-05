"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtLeastOne = AtLeastOne;
const class_validator_1 = require("class-validator");
function AtLeastOne(properties, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'atLeastOne',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [properties],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedProperties] = args.constraints;
                    const object = args.object;
                    return relatedProperties.some((prop) => {
                        const val = object[prop];
                        return val !== undefined && val !== null && val !== '';
                    });
                },
                defaultMessage(args) {
                    const [relatedProperties] = args.constraints;
                    return `Au moins un des champs suivants doit être fourni: ${relatedProperties.join(', ')}`;
                },
            },
        });
    };
}
//# sourceMappingURL=at-least-one.validator.js.map