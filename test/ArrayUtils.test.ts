import { expect } from "chai";
import SuiteMetrics from "suite-metrics";
import { getPath, printArray } from "./utils/Utils.ts";
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

        suite("Valid input", function() {

            const _test = (name: string, arr: any[], expected: any[]) => {
                test(name, () => {

                    console.log(`Running test: ${name}`);
                    console.log(`Flattening array: ${printArray(arr)}`);

                    TestTimer.startTest(getPath(this).concat(name));
                    const result = ArrayUtils.removeDuplicates(arr);
                    TestTimer.stopTest();

                    console.log(`Result: ${printArray(result)}`);
                    console.log(`Verifying it equals ${printArray(expected)}...`);
                    expect(result).to.deep.equal(expected);
                    console.log("Success!\n");
                });
            }

            _test("Empty array", [], []);

            _test("Single element", [1], [1]);

            _test("No duplicates", [1, 2, 3], [1, 2, 3]);

            _test("No duplicates #2", [7, 23, 2], [7, 23, 2]);

            _test("One duplicate", [2, 1, 3, 2], [2, 1, 3]);

            _test("One duplicate #2", [7, 6, 6], [7, 6]);

            _test("One duplicate #3", [12, 12], [12]);

            _test("Multiple duplicates", [1, 2, 3, 1, 2, 3], [1, 2, 3]);

            _test("Multiple duplicates #2", [9, 4, 23, 2, 4, 7, 8, 7, 23, 91, 83, 8, 2], [9, 4, 23, 2, 7, 8, 91, 83]);

            _test("Many of the same value", [1, 1, 1, 1, 1], [1]);

            _test("10 million of the same value", Array(10_000_000).fill(827), [827]);
        });
    });
});
