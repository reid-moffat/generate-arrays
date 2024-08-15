import SuiteMetrics from "suite-metrics";
import GenerateArrayError from "../../src/GenerateArrayError.ts";
import { expect } from "chai";

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

    protected constructor(name: string, optional: boolean) {
        this.name = name;
        this.optional = optional;
    }

    public getName(): string {
        return this.name;
    }

    // Returns an array of invalid values to test
    public abstract getTestValues(): TestData[];

    // If there are multiple parameters, we need valid values for this parameter when the other is being tested
    public abstract getValidValue(): any;

    // Turns an array of values into an array of proper TestData objects
    protected static makeValuesArray(paramName: string, values: any[]): TestData[] {
        return values.map((value: any) => {
            let stringVal = value;
            if (Array.isArray(value) || typeof value === "object" || typeof value === "string") {
                stringVal = JSON.stringify(value);
            } else if (typeof value === "bigint") {
                stringVal = value + " (BigInt)"; // BigInt(3) is not valid but shows '3', add this to make it clear
            }

            return { testName: `${paramName}: ${String(stringVal)}`, value: value } as TestData;
        });
    }
}

/**
 * Parameter that must be a number. Can be an integer, or have a min/max
 */
class NumberParameter extends Parameter {

    private readonly min: number | undefined;
    private readonly max: number | undefined;
    private readonly integer: boolean;

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {}, true, false,
        [2], { key: "value" }, { value: 1 }, () => Math.floor(Math.random() * 100), BigInt(3), Symbol("1"), NaN];

    private readonly potentialValues: number[] = [-Infinity, -1e+15 + 0.1, Number.MIN_SAFE_INTEGER, -54, -37.9, -1.2, -0.5, -1,
        -0.0000000001, 0, 0.0000000001, 0.12, 1, 1.01, 2, 3, 65.8, 93, Math.pow(2, 32), Number.MAX_SAFE_INTEGER, 1e+15 + 0.1, Infinity];

    constructor(name: string, integer: boolean, min?: number, max?: number, optional: boolean = false) {
        super(name, optional);
        this.min = min;
        this.max = max;
        this.integer = integer;
    }

    public getTestValues(): TestData[] {
        const values: any[] = this.values;
        if (this.optional) {
            values.shift(); // Remove undefined if the value is optional (undefined will default to the default param value)
        }

        this.potentialValues.forEach((value: number) => {
            if (this.integer && !Number.isInteger(value)) {
                values.push(value);
            } else if ((this.min !== undefined && value < this.min) || (this.max !== undefined && value > this.max)) {
                values.push(value);
            }
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

/**
 * Parameter that must be a boolean
 */
class BooleanParameter extends Parameter {

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {}, [2],
        { key: "value" }, { value: 1 }, () => Math.floor(Math.random() * 100), BigInt(3), Symbol("1"), NaN];

    constructor(name: string, optional: boolean = false) {
        super(name, optional);
    }

    public getTestValues(): TestData[] {
        const values: any[] = this.values;
        if (this.optional) {
            values.shift(); // Remove undefined if the value is optional (undefined will default to the default param value)
        }

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

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {}, [2],
        { key: "value" }, { value: 1 }, true, false, BigInt(3), Symbol("1"), NaN];

    private readonly returnType: string | undefined;

    constructor(name: string, returnType?: string, optional: boolean = false) {
        super(name, optional);
        this.returnType = returnType
    }

    public getTestValues(): TestData[] {
        const values: any[] = this.values;
        if (this.optional) {
            values.shift(); // Remove undefined if the value is optional (undefined will default to the default param value)
        }

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

export { TestFailures, TestFailureParams, NumberParameter, BooleanParameter, FunctionParameter, GenericParameter };
