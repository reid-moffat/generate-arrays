import SuiteMetrics from "suite-metrics";
import GenerateArrayError from "../../src/utils/GenerateArrayError.ts";
import { expect } from "chai";
import Validation from "../../src/utils/Validation.ts";
import { stringify } from "./Utils.ts";

type TestFailureParams = {
    path: string[],
    func: Function,
    parameters: Parameter | Parameter[]
};

class TestFailures {

    private static readonly TestTimer: SuiteMetrics = SuiteMetrics.getInstance();
    private static readonly SuiteName = "Invalid input";

    public static run(data: TestFailureParams): void {

        const params = Array.isArray(data.parameters) ? data.parameters : [data.parameters];

        suite(TestFailures.SuiteName, () => {
            for (const parameter of params) {
                for (const { testName, value } of parameter.getTestValues()) {

                    const functionParams = params.map((param, index) => {
                        return parameter.getName() === param.getName() ? value : param.getValidValue();
                    });

                    test(testName, () => {
                        const pathWithTest = [...data.path, TestFailures.SuiteName, testName];

                        console.log(`Running test: ${pathWithTest.join(" > ")}`);
                        let err;
                        try {
                            TestFailures.TestTimer.startTest(pathWithTest);
                            data.func(...functionParams);
                        } catch (e: any) {
                            TestFailures.TestTimer.stopTest();
                            err = e;
                        }

                        console.log(`\nFunction execution completed, verifying...`);

                        expect(err).to.be.an.instanceOf(Error);
                        console.log(`(1/3) Error was caught`);

                        expect(err).to.be.an.instanceOf(GenerateArrayError);
                        console.log(`(2/3) Error is an instance of GenerateArrayError`);

                        expect(err.message).to.be.a("string");
                        console.log(`(3/3) Error message is a string`);

                        console.log(`Test passed!\n\n`);
                    });
                }
            }
        });

    }
}

type TestData = { testName: string, value: any };

/**
 * Base class for parameters that can be tested
 */
abstract class Parameter {

    protected readonly name: string;
    protected readonly optional: boolean;

    public static readonly allValues: any[] = [
        // Misc
        undefined, null, true, false, BigInt(3), Symbol("1"), () => Math.floor(Math.random() * 100),
        () => { throw new Error("Test error") }, () => { return "string" }, () => { return 1; }, () => { return true; },

        // Numbers
        -Infinity, -1e+15 + 0.1, Number.MIN_SAFE_INTEGER, -54, -37.9, -1.2, -0.5, -1, -0.0000000001, 0, 0.0000000001,
        0.12, 1.01, 65.8, Math.pow(2, 32), Number.MAX_SAFE_INTEGER, 1e+15 + 0.1, Infinity, NaN,

        // Strings
        "", "0", "1", "-1.5", "7.6", "-1", "-427", ".", "\\", "a b c d e", "hello", "test", "string", "value", "key",
        "boolean", "number", "function", "object", "array", "bigint", "symbol", "undefined", "null", "NaN", "Infinity",

        // Arrays
        [], [0], [1], [2], [3], [156], [undefined], [null], [7, 2], [3, 2], [1, Math.pow(2, 32)], ['1', '2'], ['1', 2],
        [1, '2'], ["7", "1"], [undefined, 2], [null, 3], [undefined, null], [-1, 4], [0, 7], [1.1, 7], [2.4, 7], [3.7, 7],
        [5, 7.1], [1, 2], [2.2, 4.7], [1, 2, 3, 4, 5], [7, 2, 9, 4],

        // Objects
        {}, { key: "value" }, { value: 1 }, { value: 1, key: "value" }, { key: 1 }, { key: 1, value: "value" }, { name: "test" }
    ];

    protected constructor(name: string, optional: boolean) {
        this.name = name;
        this.optional = optional;
    }

    public getName(): string {
        return this.name;
    }

    protected getInvalidValues(filter: (value: any) => boolean): any[] {
        const values = Parameter.allValues.filter(filter);
        if (this.optional) {
            values.shift(); // Remove undefined if the value is optional (undefined will default to the default param value)
        }

        return values;
    }

    // Returns an array of invalid values to test
    public abstract getTestValues(): TestData[];

    // If there are multiple parameters, we need valid values for this parameter when the other is being tested
    public abstract getValidValue(): any;

    // Turns an array of values into an array of proper TestData objects
    protected static makeValuesArray(paramName: string, values: any[]): TestData[] {
        return values.map((value: any) => ({ testName: `${paramName}: ${stringify(value)}`, value: value }));
    }
}

type NumberParameterParams = {
    name: string,
    integer?: boolean,
    min?: number,
    max?: number,
    optional?: boolean
};

/**
 * Parameter that must be a number. Can be an integer, or have a min/max
 */
class NumberParameter extends Parameter {

    private readonly min: number | undefined;
    private readonly max: number | undefined;
    private readonly integer: boolean;

    constructor({ name, integer = false, min, max, optional = false }: NumberParameterParams) {
        super(name, optional);
        this.min = min;
        this.max = max;
        this.integer = integer;
    }

    public getTestValues(): TestData[] {
        const values = this.getInvalidValues((value) => {
            if (typeof value !== "number" || (this.integer && !Number.isInteger(value))) {
                return true;
            }
            if ((this.min !== undefined && value < this.min) || (this.max !== undefined && value > this.max)) {
                return true;
            }

            return false;
        });

        return Parameter.makeValuesArray(this.name, values);
    }

    public getValidValue(): any {
        if (this.min !== undefined && this.max !== undefined) {
            return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
        } else if (this.min !== undefined) {
            return Math.floor(this.min + Math.random() * 100);
        } else if (this.max !== undefined) {
            return Math.floor(this.max - Math.random() * 100);
        }
        return Math.floor(Math.random() * 100);
    }
}

type BooleanParameterParams = {
    name: string,
    optional?: boolean
};

/**
 * Parameter that must be a boolean
 */
class BooleanParameter extends Parameter {

    constructor({ name, optional = false }: BooleanParameterParams) {
        super(name, optional);
    }

    public getTestValues(): TestData[] {
        const values = this.getInvalidValues((value) => typeof value !== "boolean");
        return Parameter.makeValuesArray(this.name, values);
    }

    public getValidValue(): any {
        return true;
    }
}

/**
 * Parameter that must be a function
 */
class FunctionParameter extends Parameter {

    private readonly returnType: string | undefined;

    constructor(name: string, returnType?: string, optional: boolean = false) {
        super(name, optional);
        this.returnType = returnType
    }

    public getTestValues(): TestData[] {
        const values: any[] = this.getInvalidValues((value) => {
            if (typeof value !== "function") {
                return true;
            }

            let result;
            try {
                result = (value as Function)();
            } catch (e) {
                return true;
            }

            if (this.returnType && typeof result !== this.returnType) {
                return true;
            }

            return false;
        });

        return Parameter.makeValuesArray(this.name, values);
    }

    public getValidValue(): any {
        return () => Math.floor(Math.random() * 100);
    }
}

/**
 * Parameter that can take any value - i.e. no failure cases, but still needs a value to test with other params
 */
class GenericParameter extends Parameter {

    constructor(name: string) {
        super(name, false); // Optional is irrelevant here as undefined is valid (like all other values)
    }

    public getTestValues(): TestData[] {
        return Parameter.makeValuesArray(this.name, []);
    }

    public getValidValue(): any {
        return 7;
    }
}

/**
 * Parameter that can be an array length or [min, max] range for array lengths
 */
class ArrayLengthParameter extends Parameter {

    constructor(name: string, optional: boolean = false) {
        super(name, optional);
    }

    public getTestValues(): TestData[] {
        const values = this.getInvalidValues((value) => {
            if (!Number.isInteger(value) && !Array.isArray(value)) {
                return true;
            }
            if (Array.isArray(value) && (value.length !== 2 || !value.every((val) => Number.isInteger(val))
                || value[0] > value[1] || value[0] < 1 || value[1] > Validation.maxArrayLength)) {
                return true;
            }
            if (Number.isInteger(value) && (value < 1 || value > Validation.maxArrayLength)) {
                return true;
            }

            return false;
        });

        return Parameter.makeValuesArray(this.name, values);
    }

    public getValidValue(): any {
        return 3;
    }
}

/**
 * Parameter that must be an array
 */
class ArrayParameter extends Parameter {

    constructor(name: string, optional: boolean = false) {
        super(name, optional);
    }

    public getTestValues(): TestData[] {
        const values = this.getInvalidValues((value) => !Array.isArray(value));
        return Parameter.makeValuesArray(this.name, values);
    }

    public getValidValue(): any {
        return [1, 2, 3];
    }
}

export { TestFailures, TestFailureParams, Parameter, NumberParameter, BooleanParameter, FunctionParameter, GenericParameter, ArrayLengthParameter, ArrayParameter };
