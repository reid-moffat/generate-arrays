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

    private readonly potentialValues: number[] = [-Infinity, -1e+15 + 0.1, Number.MIN_SAFE_INTEGER, -54, -37.9, -1.2, -0.5,
        -1, -0.0000000001, 0, 0.0000000001, 0.12, 1, 1.01, 2, 3, 65.8, 93, Math.pow(2, 32), Number.MAX_SAFE_INTEGER, 1e+15 + 0.1, Infinity];

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
