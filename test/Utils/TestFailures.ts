import SuiteMetrics from "suite-metrics";
import GenerateArrayError from "../../src/GenerateArrayError.ts";

enum ParameterConstraint {
    Number = "number",
    Integer = "integer",
    Integer_NonNegative = "integer_nonnegative",
    Integer_Positive = "integer_positive",
}

class TestFailures {

    private static readonly TestTimer: SuiteMetrics = SuiteMetrics.getInstance();

    private readonly path: string[];
    private readonly func: Function;
    private readonly parameters: Map<string, ParameterConstraint[]> = new Map<string, ParameterConstraint[]>();

    constructor(path: string[], func: Function) {
        this.path = path;
        this.func = func;
    }

    public addParameter(name: string, constraints: ParameterConstraint[]): void {
        this.parameters.set(name, constraints);
    }

    public runTests() {
        const testValues = new Map<string, any>();
        this.parameters.forEach((constraints, name) => {
            testValues.set(name, undefined);
            testValues.set(name, null);
            testValues.set(name, "");
            testValues.set(name, []);
            testValues.set(name, {});
        });

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

        return tests;
    }

    public getPath(): string[] {
        return this.path;
    }
}

export default TestFailures;
