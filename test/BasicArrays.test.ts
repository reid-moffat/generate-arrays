import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";
import SuiteMetrics from "suite-metrics";
import {
    TestFailures,
    NumberParameter,
    GenericParameter,
    BooleanParameter,
    FunctionParameter, TestFailureParams
} from "./Utils/TestFailures.ts";
import { getPath } from "./Utils/Utils.ts";

const TestTimer = SuiteMetrics.getInstance();

suite("Basic array functions", () => {

    suite("Blank array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.blank,
            parameters: new NumberParameter("length", true, 1)
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (name: string, length: number) => {
                test(name, () => {
                    TestTimer.startTest(getPath(this).concat(name));
                    const arr = GenerateArray.blank(length);
                    TestTimer.stopTest();

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.be.undefined;
                    });
                });
            }

            _test("Length 1", 1);

            _test("Length 3", 3);

            _test("Length 1,000", 1_000);

            _test("Length 100,000", 100_000);

            _test("Length 10 million", 10_000_000);
        });
    });

    suite("Uniform array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.uniform,
            parameters: [
                new NumberParameter("length", true, 1),
                new GenericParameter("value")
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Value 1 Length 1", () => {
                const arr = GenerateArray.uniform(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Value 7 Length 3", () => {
                const arr = GenerateArray.uniform(3, 7);
                expect(arr).to.deep.equal([7, 7, 7]);
            });

            test("Value [1, 2, 3] Length 3", () => {
                const arr = GenerateArray.uniform(3, [1, 2, 3]);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 1", () => {
                const arr = GenerateArray.uniform(1, [1, 2, 3]);
                expect(arr).to.deep.equal([[1, 2, 3]]);
            });
        });
    });

    suite("Custom array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.custom,
            parameters: [
                new FunctionParameter("value"),
                new NumberParameter("length", true, 1)
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Value 7 Length 1", () => {
                const arr = GenerateArray.custom(() => 7, 1);
                expect(arr).to.deep.equal([7]);
            });

            test("Value 7 Length 3", () => {
                const arr = GenerateArray.custom(() => 7, 3);
                expect(arr).to.deep.equal([7, 7, 7]);
            });

            test("Value [1, 2, 3] Length 3", () => {
                const arr = GenerateArray.custom(() => [1, 2, 3], 3);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 1", () => {
                const arr = GenerateArray.custom(() => [1, 2, 3], 1);
                expect(arr).to.deep.equal([[1, 2, 3]]);
            });
        });
    });

    suite("Counting array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.counting,
            parameters: [
                new NumberParameter("start", false),
                new NumberParameter("end", false),
                new NumberParameter("step", false, undefined, undefined, true)
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.counting(1, 7);
                expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.counting(3, 4);
                expect(arr).to.deep.equal([3, 4]);
            });

            test("Reverse 7 to 3", () => {
                const arr = GenerateArray.counting(7, 2, -2);
                expect(arr).to.deep.equal([7, 5, 3]);
            });
        });
    });

    suite("Integer array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.integers,
            parameters: [
                new NumberParameter("length", true, 1),
                new NumberParameter("min", false, undefined, undefined, true),
                new NumberParameter("max", false, undefined, undefined, true)
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.integers(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.satisfy((num: number) => Number.isInteger(num));
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(100);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.integers(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.satisfy((num: number) => Number.isInteger(num));
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(100);
                });
            });
        });
    });

    suite("Decimal array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.decimals,
            parameters: [
                new NumberParameter("length", true, 1),
                new NumberParameter("min", false, undefined, undefined, true),
                new NumberParameter("max", false, undefined, undefined, true)
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.decimals(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(1);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.decimals(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(1);
                });
            });
        });
    });

    suite("Strings array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.strings,
            parameters: [
                new NumberParameter("length", true, 1),
                new NumberParameter("minLength", true, 1, undefined, true),
                new NumberParameter("maxLength", true, undefined, undefined, true),
                new BooleanParameter("specialChars", true)
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.strings(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("string");
                    expect(val.length).to.be.at.least(1);
                    expect(val.length).to.be.at.most(10);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.strings(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("string");
                    expect(val.length).to.be.at.least(1);
                    expect(val.length).to.be.at.most(10);
                });
            });
        });
    });

});
