import GenerateArrayError from "./GenerateArraysError.ts";

class Validation {
    static integer(value: any, min: number, paramName: string): void {
        if (!Number.isInteger(value)) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be an integer: value '${value}' is invalid`);
        }
        if (value < min) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be at least ${min}: value '${value}' is invalid`);
        }
    }
}

export default Validation;
