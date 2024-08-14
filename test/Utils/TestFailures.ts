import SuiteMetrics from "suite-metrics";
import GenerateArrayError from "../../src/GenerateArrayError.ts";
import { expect } from "chai";

class TestFailures {

    private static readonly TestTimer: SuiteMetrics = SuiteMetrics.getInstance();

    private readonly path: string[];
    private readonly func: Function;
    private readonly parameters: Parameter[];

    constructor(path: string[], func: Function, parameters: Parameter | Parameter[]) {
        this.path = path;
        this.func = func;
        this.parameters = Array.isArray(parameters) ? parameters : [parameters];
    }

    public runTests(): void {

        for (const parameter of this.parameters) {
            for (const { testName, value } of parameter.getValues()) {
                test(testName, () => {
                    const pathWithTest = [...this.path.slice(), testName];

                    console.log(`Running test: ${pathWithTest.join(" > ")}`);
                    let err;
                    try {
                        TestFailures.TestTimer.startTest(pathWithTest);
                        this.func(value);
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
    }
}

type TestData = { testName: string, value: any };

abstract class Parameter {

    protected readonly name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    // Returns an array of tests to run
    public abstract getValues(): TestData[];

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

class NumberParameter extends Parameter {

    private readonly min: number | undefined;
    private readonly max: number | undefined;
    private readonly integer: boolean;

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {}, true, false,
        [2], { key: "value" }, { value: 1 }, () => Math.floor(Math.random() * 100), BigInt(3), Symbol("1"), NaN];

    private readonly potentialValues: number[] = [-Infinity, -1e+15 + 0.1, Number.MIN_SAFE_INTEGER, -54, -37.9, -1.2, -0.5, -1,
        -0.0000000001, 0, 0.0000000001, 0.12, 1, 1.01, 2, 3, 65.8, 93, Math.pow(2, 32), Number.MAX_SAFE_INTEGER, 1e+15 + 0.1, Infinity];

    constructor(name: string, integer: boolean, min?: number, max?: number) {
        super(name);
        this.min = min;
        this.max = max;
        this.integer = integer;
    }

    public getValues(): TestData[] {
        const values: any[] = this.values;
        this.potentialValues.forEach((value: number) => {
            if (this.integer && !Number.isInteger(value)) {
                values.push(value);
            } else if ((this.min === undefined || value < this.min) && (this.max === undefined || value > this.max)) {
                values.push(value);
            }
        });

        return Parameter.makeValuesArray(this.name, values);
    }
}

export { TestFailures, NumberParameter };
