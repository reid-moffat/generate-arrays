import SuiteMetrics from "suite-metrics";

const TestTimer = SuiteMetrics.getInstance();

suite("Test metrics", () => {
    test("All suite metrics", () => {
        console.log(TestTimer.printAllSuiteMetrics(true));
    });
});
