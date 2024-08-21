import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";
import SuiteMetrics from "suite-metrics";
import {
    TestFailures,
    NumberParameter,
    GenericParameter,
    BooleanParameter,
    FunctionParameter,
    TestFailureParams,
    ArrayLengthParameter
} from "./utils/TestFailures.ts";
import { getPath } from "./utils/Utils.ts";

const TestTimer = SuiteMetrics.getInstance();

suite("Basic array functions", function() {

    suite("Blank array", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: GenerateArray.blank,
            parameters: new ArrayLengthParameter("length")
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (name: string, length: number) => {
                test(name, function() {
                    TestTimer.startTest(getPath(this));
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
                new ArrayLengthParameter("length"),
                new GenericParameter("value")
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Value 1 Length 1", function() {
                const arr = GenerateArray.uniform(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Value 7 Length 3", function() {
                const arr = GenerateArray.uniform(3, 7);
                expect(arr).to.deep.equal([7, 7, 7]);
            });

            test("Value [1, 2, 3] Length 3", function() {
                const arr = GenerateArray.uniform(3, [1, 2, 3]);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 1", function() {
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
                new ArrayLengthParameter("length")
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Value 7 Length 1", function() {
                const arr = GenerateArray.custom(() => 7, 1);
                expect(arr).to.deep.equal([7]);
            });

            test("Value 7 Length 3", function() {
                const arr = GenerateArray.custom(() => 7, 3);
                expect(arr).to.deep.equal([7, 7, 7]);
            });

            test("Value [1, 2, 3] Length 3", function() {
                const arr = GenerateArray.custom(() => [1, 2, 3], 3);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 1", function() {
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
                new NumberParameter({ name: "start" }),
                new NumberParameter({ name: "end" }),
                new NumberParameter({ name: "step", optional: true })
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Length 1", function() {
                const arr = GenerateArray.counting(1, 7);
                expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
            });

            test("Length 3", function() {
                const arr = GenerateArray.counting(3, 4);
                expect(arr).to.deep.equal([3, 4]);
            });

            test("Reverse 7 to 3", function() {
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
                new ArrayLengthParameter("length"),
                new NumberParameter({ name: "min", optional: true }),
                new NumberParameter({ name: "max", optional: true })
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Length 1", function() {
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

            test("Length 3", function() {
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
                new ArrayLengthParameter("length"),
                new NumberParameter({ name: "min", optional: true }),
                new NumberParameter({ name: "max", optional: true }),
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Length 1", function() {
                const arr = GenerateArray.decimals(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(1);
                });
            });

            test("Length 3", function() {
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
                new ArrayLengthParameter("length"),
                new NumberParameter({ name: "minLength", integer: true, min: 1, optional: true }),
                new NumberParameter({ name: "maxLength", integer: true, optional: true }),
                new BooleanParameter({ name: "specialChars", optional: true })
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {
            test("Length 1", function() {
                const arr = GenerateArray.strings(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("string");
                    expect(val.length).to.be.at.least(1);
                    expect(val.length).to.be.at.most(10);
                });
            });

            test("Length 3", function() {
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
