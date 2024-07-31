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

    static array(value: any, paramName: string): void {
        if (!Array.isArray(value)) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be an array: value '${value}' is invalid`);
        }
    }

    static function(value: any, paramName: string, returnArray: boolean = false): void {
        if (typeof value !== "function") {
            throw new GenerateArrayError(`Parameter '${paramName}' must be a function: value '${value}' is invalid`);
        }
        if (value.length !== 0) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be a function with no parameters: value '${value}' is invalid`);
        }

        let result;
        try {
            result = (value as Function)();
        } catch (e) {
            throw new GenerateArrayError(`Error occurred while executing function '${paramName}': ${e}`);
        }

        if (!returnArray && Array.isArray(result)) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be a function that returns a non-array value: value '${value}' is invalid`);
        }
        if (returnArray && !Array.isArray(result)) {
            throw new GenerateArrayError(`Parameter '${paramName}' must be a function that returns an array: value '${value}' is invalid`);
        }
    }
}

export default Validation;
