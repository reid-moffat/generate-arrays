import { expect } from "chai";
import SuiteMetrics from "suite-metrics";
import { getPath } from "./utils/Utils.ts";
import ArrayUtils from "../src/functions/ArrayUtils.ts";
import { ArrayParameter, NumberParameter, TestFailureParams, TestFailures } from "./utils/TestFailures.ts";

const TestTimer = SuiteMetrics.getInstance();

suite("Array Utils", () => {

    suite("Add Dimensions", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ArrayUtils.addDimensions,
            parameters: [
                new ArrayParameter("arr"),
                new NumberParameter({ name: "depth", integer: true, min: 1 }),
            ]
        };
        TestFailures.run(failureTestData);
    });
});
