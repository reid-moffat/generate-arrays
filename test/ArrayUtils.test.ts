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

        suite("Valid input", function() {

            const _test = (name: string, arr: any[], expected: any[]) => {
                test(name, () => {

                    console.log(`Running test: ${name}`);
                    console.log(`Flattening array: ${printArray(arr)}`);

                    TestTimer.startTest(getPath(this).concat(name));
                    const result = ArrayUtils.flatten(arr);
                    TestTimer.stopTest();

                    console.log(`Result: ${printArray(result)}`);
                    console.log(`Verifying it equals ${printArray(expected)}...`);
                    expect(result).to.deep.equal(expected);
                    console.log("Success!\n");
                });
            }

            _test("Empty array", [], []);

            _test("Single element", [1], [1]);

            _test("Single nested array", [[1]], [1]);

            _test("Two nested arrays", [[1], [2]], [1, 2]);

            _test("Three nested arrays", [[1], [2], [3]], [1, 2, 3]);

            _test("Nested arrays", [1, [2, 3], [4, [5, 6]]], [1, 2, 3, 4, 5, 6]);

            _test("Two levels of nesting", [1, [2, [3, 4], 5], 6], [1, 2, 3, 4, 5, 6]);

            _test("Three levels of nesting", [1, [2, [3, [4, 5], 6], 7], 8], [1, 2, 3, 4, 5, 6, 7, 8]);

            _test("Four levels of nesting", [1, [2, [3, [4, [5, 6], 7], 8], 9], 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            _test("Five levels of nesting", [1, [2, [3, [4, [5, [6, 7], 8], 9], 10], 11], 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

            _test("1 million elements", Array(1_000_000).fill(7), Array(1_000_000).fill(7));

            _test("1 million elements, nested", Array(1_000_000).fill([7]), Array(1_000_000).fill(7));

            _test("1 million elements, 2 levels of nesting", Array(1_000_000).fill([7, [8]]), Array(2_000_000).fill(1).map((_, i) => i % 2 === 0 ? 7 : 8));

            _test("1 million nested arrays", Array(1_000_000).fill([7, 8]), Array(2_000_000).fill(1).map((_, i) => i % 2 === 0 ? 7 : 8));

            _test("Element nested in 1,000 layers", Array(1_000).fill(undefined).reduce(acc => [acc], 13), [13]);

        });
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

        suite("Valid input", function() {

            const _test = (name: string, arr: any[], factor: number, elementWise: boolean, expected: any[]) => {
                test(name, () => {

                    console.log(`Running test: ${name}`);
                    console.log(`Original array: ${printArray(arr)}`);

                    TestTimer.startTest(getPath(this).concat(name));
                    const result = ArrayUtils.multiplyLength(arr, factor, elementWise);
                    TestTimer.stopTest();

                    console.log(`Result: ${printArray(result)}`);
                    console.log(`Verifying it equals ${printArray(expected)}...`);
                    expect(result).to.deep.equal(expected);
                    console.log("Success!\n");
                });
            }

            _test("Empty array", [], 2, false, []);

            _test("Empty array, element-wise", [], 2, true, []);

            _test("Single element", [1], 3, false, [1, 1, 1]);

            _test("Single element, element-wise", [1], 3, true, [1, 1, 1]);

            _test("Multiple elements", [1, 2], 3, false, [1, 2, 1, 2, 1, 2]);

            _test("Multiple elements, element-wise", [1, 2], 3, true, [1, 1, 1, 2, 2, 2]);

            _test("Multiple elements, factor 4", [1, 2, 3], 4, false, [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]);

            _test("Multiple elements, factor 4, element-wise", [1, 2, 3], 4, true, [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3]);

            _test("Multiple elements, factor 2, element-wise", [1, 2, 3], 2, true, [1, 1, 2, 2, 3, 3]);

            _test("Multiple elements, factor 3, element-wise", [1, 2, 3], 3, true, [1, 1, 1, 2, 2, 2, 3, 3, 3]);

            _test("Single element, factor of 10 million", [1], 10_000_000, false, Array(10_000_000).fill(1));

            _test("Three elements, factor of 10 million", [1, 2, 3], 10_000_000, false, Array(30_000_000).fill(1).map((_, i) => i % 3 + 1));

            _test("Three elements, factor of 10 million, element-wise", [1, 2, 3], 10_000_000, true, Array(30_000_000).fill(1).map((_, i) => Math.floor(i / 10_000_000) + 1));

        });
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
