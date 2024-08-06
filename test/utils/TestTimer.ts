import microseconds from "microseconds";

interface TestResult {
    startTime: number
    endTime: number
    runtime: number
}

interface TestPath {
    namespace: "Basic functions" | "Multi Generators" | "Multi Dimensional" | "Generators" | "Array Utils",
    method: string
    type: "Invalid" | "Valid"
    name: string
}

class TestTimer {

    private static TestResults: Map<string, Map<string, Map<"Invalid" | "Valid", Map<string, TestResult>>>> = new Map();

    private static currentTest: undefined | TestPath = undefined;
    private static currentStartTime: number = 0;

    // Makes sure all the maps exist for a given TC
    private static makePath(path: TestPath) {
        if (!this.TestResults.has(path.namespace)) {
            this.TestResults.set(path.namespace, new Map());
        } // @ts-ignore
        if (!this.TestResults.get(path.namespace).has(path.method)) { // @ts-ignore
            this.TestResults.get(path.namespace).set(path.method, new Map());
        } // @ts-ignore
        if (!this.TestResults.get(path.namespace).get(path.method).has(path.type)) { // @ts-ignore
            this.TestResults.get(path.namespace).get(path.method).set(path.type, new Map());
        }
    }

    public static start(path: TestPath): void {
        this.makePath(path);
        this.currentTest = path;

        this.currentStartTime = microseconds.now();
    }

    public static stop(): void {
        const endTime = microseconds.now();

        if (this.currentTest === undefined) {
            throw new Error("No current test running - call .start() first");
        }

        const { namespace, method, type, name } = this.currentTest;
        const startTime = this.currentStartTime;
        const result: TestResult = {
            startTime: startTime,
            endTime: endTime,
            runtime: endTime - startTime,
        };

        // @ts-ignore
        this.TestResults.get(namespace).get(method).get(type).set(name, result);
    }

    public static getResult(test: TestPath): TestResult | undefined {
        return this.TestResults?.get(test.namespace)?.get(test.method)?.get(test.type)?.get(test.name);
    }

    public static printTestTiming(test: TestPath): void {
        const result = this.getResult(test);
        if (result === undefined) {
            console.log(`No timing found for ${test.namespace} ${test.method} ${test.type} ${test.name}`);
            return;
        }

        console.log("Timing: \n" + JSON.stringify(result, null, 4));
    }

    public static printTimings(): void {
        for (const [namespace, methods] of this.TestResults) {
            console.log(`\n${namespace}`);
            for (const [method, types] of methods) {
                console.log(`\n${method}`);
                for (const [type, timings] of types) {
                    console.log(`\n${type}`);
                    for (const [name, timing] of timings) {
                        console.log(`${name}: ${(timing.runtime / 1000).toFixed(2)}ms`);
                    }
                }
            }
        }
    }
}

export { TestTimer, TestPath };
