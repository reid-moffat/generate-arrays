import { TestTimer } from "../BasicArrays.test.ts";

suite("Test metrics", () => {
    test("All suites", () => {
        console.log(TestTimer.printAllSuiteMetrics(true));
    });
});
