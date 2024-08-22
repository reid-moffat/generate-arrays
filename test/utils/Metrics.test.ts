import SuiteMetrics from "suite-metrics";
import { log } from "./Utils.ts";

const TestTimer = SuiteMetrics.getInstance();

suite("Test metrics", function() {
    test("All suite metrics", function() {
        log(TestTimer.printAllSuiteMetrics(true));
    });

    test("All test metrics", function() {
        console.log(TestTimer.getSuiteMetrics([]));
    });

    test("All test metrics recursive", function() {
        console.log(TestTimer.getSuiteMetricsRecursive([]));
    });
});
