import SuiteMetrics from "suite-metrics";

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

                    let error;
                    try {
                        TestFailures.TestTimer.startTest(pathWithTest);
                        this.func(value);
                    } catch (err: any) {
                        TestFailures.TestTimer.stopTest();
                        error = err;
                        console.log(JSON.stringify(error, null, 4));
                    }
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

    public abstract getValues(): TestData[];

    private static readonly values: { [key: string]: any[] }  = {
        nullish: [undefined, null],
        empty: ["", [], {}],

        negativeIntegers: [-Infinity, -1e+15, -54, -1],
        nonPositiveIntegers: [-Infinity, -1e+15, -54, -1, 0],
        negativeDecimals: [-1e+15 + 0.1, -1.2, -0.5, -0.0000000001],

        boolean: [true, false],

        strings: [".", "\\", "a b c d e", "0", "1", "-1.5"],
    }

    protected static makeValuesArray(paramName: string, values: any[]): TestData[] {
        return values.map((value: any) => {
            let stringifyVal = value;
            if (typeof value === "bigint") {
                stringifyVal = value.toString() + " (BigInt)"; // BigInts are not JSON serializable
            }

            return { testName: `${paramName}: ${JSON.stringify(stringifyVal)}`, value: value } as TestData;
        });
    }
}

class NumberParameter extends Parameter {

    private readonly min: number | null;
    private readonly max: number | null;
    private readonly integer: boolean;

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {}, true, false,
        [2], { key: "value" }, { value: 1 }, () => Math.floor(Math.random() * 100), BigInt(3), Symbol("1"), NaN];
    private readonly potentialValues: number[] = [-Infinity, Number.MIN_SAFE_INTEGER, -1e+15 + 0.1, -54, -37.9, -1.2, -0.5, -1, -0.0000000001, 0,
        0.0000000001, 0.12, 1, 1.01, 2, 3, 65.8, 93, Math.pow(2, 32), 1e+15 + 0.1, Number.MAX_SAFE_INTEGER, Infinity];

    constructor(name: string, integer: boolean, min?: number, max?: number) {
        super(name);
        this.min = min ?? null;
        this.max = max ?? null;
        this.integer = integer;
    }

    public getValues(): TestData[] {
        const values: any[] = this.values;
        this.potentialValues.forEach((value: number) => {
            if (this.integer && !Number.isInteger(value)) {
                values.push(value);
            } else if ((this.min === null || value >= this.min) && (this.max === null || value <= this.max)) {
                values.push(value);
            }
        });

        return Parameter.makeValuesArray(this.name, values);
    }
}

export { TestFailures, NumberParameter };
