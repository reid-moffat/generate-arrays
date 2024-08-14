import GenerateArrayError from "./GenerateArrayError.ts";

const str = (value: any) => {
    if (typeof value === 'object' || Array.isArray(value)) {
        return JSON.stringify(value);
    }
    return String(value);
}

class Validation {

    private static readonly maxArrayLength: number = 4294967295; // 2^32 - 1

    static integer(value: any, min: number, paramName: string): void {
        if (!Number.isInteger(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an integer: value '${str(value)}' is invalid`);
        }
        if (value < min) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be at least ${str(min)}: value '${str(value)}' is invalid`);
        }
    }

    static arrayLength(length: any, min: number, paramName: string): void {
        if (!Number.isInteger(length)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an integer: value '${str(length)}' is invalid`);
        }
        if (length < min) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be at least ${str(min)}: value '${str(length)}' is invalid`);
        }
        if (length > Validation.maxArrayLength) {
            throw new GenerateArrayError(`Invalid array length: ${str(length)} exceeds ${Validation.maxArrayLength} (2^32 - 1)`);
        }
    }

    static number(value: any, threshold: number, paramName: string, above: boolean = true): void {
        if (typeof value !== "number") {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a number: value '${str(value)}' is invalid`);
        }
        if (above && value <= threshold) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be greater than ${str(threshold)}: value '${str(value)}' is invalid`);
        }
        if (!above && value >= threshold) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be less than ${str(threshold)}: value '${str(value)}' is invalid`);
        }
    }

    static array(value: any, paramName: string): void {
        if (!Array.isArray(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an array: value '${str(value)}' is invalid`);
        }
    }

    static function(value: any, paramName: string, returnArray: boolean = false): void {
        if (typeof value !== "function") {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a function: value '${str(value)}' is invalid`);
        }
        if (value.length !== 0) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a function with no parameters: value '${str(value)}' is invalid`);
        }

        let result;
        try {
            result = (value as Function)();
        } catch (e) {
            throw new GenerateArrayError(`Error occurred while executing function '${str(paramName)}': ${str(e)}`);
        }
        if (returnArray && !Array.isArray(result)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a function that returns an array: value '${str(value)}' is invalid`);
        }
    }
}

export default Validation;
