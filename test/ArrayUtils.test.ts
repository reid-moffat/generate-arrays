import { expect } from "chai";
import SuiteMetrics from "suite-metrics";
import { getPath } from "./utils/Utils.ts";
import ArrayUtils from "../src/functions/ArrayUtils.ts";
import {
    ArrayParameter,
    BooleanParameter,
    NumberParameter,
    TestFailureParams,
    TestFailures
} from "./utils/TestFailures.ts";

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

    suite("Flatten", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ArrayUtils.flatten,
            parameters: new ArrayParameter("arr")
        }
        TestFailures.run(failureTestData);
    });

    suite("Multiply Length", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ArrayUtils.multiplyLength,
            parameters: [
                new ArrayParameter("arr"),
                new NumberParameter({ name: "factor", integer: true, min: 2 }),
                new BooleanParameter({ name: "elementWise", optional: true })
            ]
        }
        TestFailures.run(failureTestData);
    });

    suite("Remove Duplicates", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ArrayUtils.removeDuplicates,
            parameters: new ArrayParameter("arr")
        }
        TestFailures.run(failureTestData);
    });
});
