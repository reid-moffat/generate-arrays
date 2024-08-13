import SuiteMetrics from "suite-metrics";

class TestFailures {

    private static readonly TestTimer: SuiteMetrics = SuiteMetrics.getInstance();

    private readonly path: string[];
    private readonly func: Function;
    private readonly parameterTests: Map<string, Parameter> = new Map<string, Parameter>();

    constructor(path: string[], func: Function, parameters: Parameter | Parameter[]) {
        this.path = path;
        this.func = func;
    }

    public runTests(): void {
        // const testValues = new Map<string, any>();
        // this.parameters.forEach((constraints, name) => {
        //     testValues.set(name, undefined);
        //     testValues.set(name, null);
        //     testValues.set(name, "");
        //     testValues.set(name, []);
        //     testValues.set(name, {});
        // });

        const tests = [];
        tests.push(
            () => {
                const pathWithTest = this.path.slice();
                pathWithTest.push(`generated test: ${undefined}`);

                try {
                    TestFailures.TestTimer.startTest(pathWithTest);
                    this.func(undefined);
                } catch (error) {
                    TestFailures.TestTimer.stopTest();
                    console.log(JSON.stringify(error, null, 4));
                }
            }
        );

        tests.forEach(t => {
            test("test failure test in class", () => t());
        });
    }
}

abstract class Parameter {

    protected readonly name: string;

    protected constructor(name: string) {
        this.name = name;
    }
}

class NumberParameter extends Parameter {

    private readonly min: number | null;
    private readonly max: number | null;
    private readonly integer: boolean;

    constructor(name: string, integer: boolean, min?: number, max?: number) {
        super(name);
        this.min = min ?? null;
        this.max = max ?? null;
        this.integer = integer;
    }
}

export { TestFailures, NumberParameter };
