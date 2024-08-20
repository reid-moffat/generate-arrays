import SuiteMetrics from "suite-metrics";

const TestTimer = SuiteMetrics.getInstance();

suite("Test metrics", () => {
    test("All suite metrics", () => {
        console.log(TestTimer.printAllSuiteMetrics(true));
    });

    test("All test metrics", () => {
        console.log(TestTimer.getSuiteMetrics([]));
    });

    test("All test metrics recursive", () => {
        console.log(TestTimer.getSuiteMetricsRecursive([]));
    });
});
