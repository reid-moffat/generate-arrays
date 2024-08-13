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
            for (const [name, value] of parameter.getValues()) {
                test(name, () => {
                    const pathWithTest = [...this.path.slice(), name];

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

abstract class Parameter {

    protected readonly name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    public abstract getValues(): Map<string, any>;

    private static readonly values: { [key: string]: any[] }  = {
        nullish: [undefined, null],
        empty: ["", [], {}],

        negativeIntegers: [-Infinity, -1e+15, -54, -1],
        nonPositiveIntegers: [-Infinity, -1e+15, -54, -1, 0],
        negativeDecimals: [-1e+15 + 0.1, -1.2, -0.5, -0.0000000001],

        boolean: [true, false],

        strings: [".", "\\", "a b c d e", "0", "1", "-1.5"],
    }

    private static makeValuesMap(paramName: string, values: any[]): Map<string, any> {
        return new Map<string, any>(values.map((value: any) => [`${paramName}: ${JSON.stringify(value)}`, value]));
    }

    protected static nonNumbers(paramName: string): Map<string, any> {
        const values: any[] = [undefined, null, "", [], {}];
        return Parameter.makeValuesMap(paramName, values);
    }
}

class NumberParameter extends Parameter {

    private readonly min: number | null;
    private readonly max: number | null;
    private readonly integer: boolean;

    private readonly values: any[] = [undefined, null, "", "0", "1", "-1.5", ".", "\\", "a b c d e", [], {},
        true, false, [73], { key: "value" }, { value: 1 },
        -1e+15 + 0.1, -37.9, -1.2, -0.5, -0.0000000001, 0.0000000001, 0.12, 1.01, 65.8, 1e+15 + 0.1, NaN];
    private readonly potentialValues: number[] = [-Infinity, -54, -1, 0, 1, 2, 3, 93, Infinity];

    constructor(name: string, integer: boolean, min?: number, max?: number) {
        super(name);
        this.min = min ?? null;
        this.max = max ?? null;
        this.integer = integer;
    }

    public getValues(): Map<string, any> {
        return Parameter.nonNumbers(this.name);
    }
}

export { TestFailures, NumberParameter };
