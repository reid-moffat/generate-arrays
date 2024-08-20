import GenerateArrayError from "./GenerateArrayError.ts";

const str = (value: any) => {
    if (typeof value === 'object' || Array.isArray(value)) {
        return JSON.stringify(value);
    }
    return String(value);
}

class Validation {

    public static readonly maxArrayLength: number = 4294967295; // 2^32 - 1

    public static integer(value: any, paramName: string, min?: number): void {
        if (!Number.isInteger(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an integer: value '${str(value)}' is invalid`);
        }
        if (min !== undefined && value < min) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be at least ${str(min)}: value '${str(value)}' is invalid`);
        }
    }

    public static arrayLength(length: any, paramName: string, min: number = 1): void {
        if (typeof length === "number") {
            if (!Number.isInteger(length)) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an integer: value '${str(length)}' is invalid`);
            }
            if (length < min) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' must be at least ${str(min)}: value '${str(length)}' is invalid`);
            }
            if (length > Validation.maxArrayLength) {
                throw new GenerateArrayError(`Invalid array length: ${str(length)} exceeds ${Validation.maxArrayLength} (2^32 - 1)`);
            }
        } else if (Array.isArray(length)) {
            if (length.length !== 2) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' must have the array format [min, max]: value '${str(length)}' is invalid`);
            }
            if (!Number.isInteger(length[0])) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' must have an integer as range min: value '${str(length[0])}' is invalid`);
            }
            if (!Number.isInteger(length[1])) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' must have an integer as range max: value '${str(length[1])}' is invalid`);
            }

            if (length[0] < min) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' min value must be at least ${str(min)}: value '${str(length[0])}' is invalid`);
            }
            if (length[0] > length[1]) {
                throw new GenerateArrayError(`Parameter '${str(paramName)}' min value must be less than max value: value '${str(length)}' is invalid`);
            }
            if (length[1] > Validation.maxArrayLength) {
                throw new GenerateArrayError(`Invalid array length: ${str(length[1])} exceeds ${Validation.maxArrayLength} (2^32 - 1)`);
            }
        } else {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an integer or a [min, max] array: value '${str(length)}' is invalid`);
        }
    }

    public static numberSimple(value: any, paramName: string): void {
        if (typeof value !== "number") {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a number: value '${str(value)}' is invalid`);
        }
        if (Number.isNaN(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a number: value '${str(value)}' is invalid`);
        }
    }

    public static number(value: any, paramName: string, min?: number, max?: number): void {
        if (typeof value !== "number") {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a number: value '${str(value)}' is invalid`);
        }
        if (Number.isNaN(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a number: value '${str(value)}' is invalid`);
        }

        if (min !== undefined && value < min) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be greater than ${str(min)}: value '${str(value)}' is invalid`);
        }
        if (max !== undefined && value > max) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be less than ${str(max)}: value '${str(value)}' is invalid`);
        }
    }

    public static boolean(value: any, paramName: string): void {
        if (typeof value !== "boolean") {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be a boolean: value '${str(value)}' is invalid`);
        }
    }

    public static array(value: any, paramName: string): void {
        if (!Array.isArray(value)) {
            throw new GenerateArrayError(`Parameter '${str(paramName)}' must be an array: value '${str(value)}' is invalid`);
        }
    }

    public static function(value: any, paramName: string, returnArray: boolean = false): void {
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
