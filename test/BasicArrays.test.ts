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
    ArrayLengthParameter, Parameter
} from "./utils/TestFailures.ts";
import { biasRandom, formatNumber, getPath, printOutput, stringify } from "./utils/Utils.ts";

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

            const _test = (length: number) => {
                const testName = `Length ${formatNumber(length)}`;
                test(testName, function() {

                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.blank(length);
                    TestTimer.stopTest();
                    console.log(`Test completed, length: ${formatNumber(arr.length)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.be.undefined;
                    });
                    console.log("Test passed!\n");
                });
            }

            _test(1);

            _test(3);

            _test(1_000);

            _test(100_000);

            _test(10_000_000);

            for (let i = 1; i <= 100; ++i) {
                const length = biasRandom(10_000_000);
                _test(length);
            }
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

            const _test = (value: any, length: number) => {
                const name = `Value ${stringify(value)} Length ${formatNumber(length)}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.uniform(length, value);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.deep.equal(value);
                    });

                    console.log("Test passed!\n");
                });
            }

            _test(7, 1);

            _test(7, 3);

            _test([1, 2, 3], 3);

            _test([1, 2, 3], 1);

            for (let i = 1; i <= 100; ++i) {
                const length = biasRandom(10_000);
                const value = Math.floor(Math.random() * 100);
                _test(value, length);
            }

            for (let i = 1; i <= 1000; ++i) {
                const length = biasRandom(10_000);
                const value = Parameter.allValues[Math.floor(Math.random() * Parameter.allValues.length)];
                _test(value, length);
            }
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

            type generator = { generator: () => any, validator: (value: any) => void };
            const generators: generator[] = [
                {
                    generator: () => Math.floor(Math.random() * 100),
                    validator: (value: any) => {
                        expect(value).to.be.a("number");
                        expect(value).to.be.at.least(0);
                        expect(value).to.be.lessThan(100);
                    }
                },
                {
                    generator: () => Math.random(),
                    validator: (value: any) => {
                        expect(value).to.be.a("number");
                        expect(value).to.be.at.least(0);
                        expect(value).to.be.lessThan(1);
                    }
                },
                {
                    generator: () => Math.random() > 0.5,
                    validator: (value: any) => {
                        expect(value).to.be.a("boolean");
                    }
                },
                {
                    generator: () => Math.random().toString(36).substring(7),
                    validator: (value: any) => {
                        expect(value).to.be.a("string");
                        expect(value.length).to.be.at.least(1);
                        expect(value.length).to.be.at.most(10);
                    }
                }
            ];

            const _test = (generator: generator, length: number) => {
                const name = `Function: ${stringify(generator.generator)} Length ${formatNumber(length)}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.custom(generator.generator, length);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        generator.validator(val);
                    });

                    console.log("Test passed!\n");
                });
            }

            for (let i = 1; i <= 200; ++i) {
                const generator = generators[Math.floor(Math.random() * generators.length)];
                const length = biasRandom(10_000);
                _test(generator, length);
            }
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

            const _test = (start: number, end: number, step: number) => {
                const name = `Start ${formatNumber(start)} End ${formatNumber(end)} Step ${formatNumber(step)}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.counting(start, end, step);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(Math.floor((end - start) / step) + 1);
                    arr.forEach((val, index) => {
                        expect(val).to.be.a("number");
                        expect(val).to.be.closeTo(start + index * step, 0.000001);
                    });

                    console.log("Test passed!\n");
                });
            }

            _test(0, 0, 1);

            _test(1, 10, 1);

            _test(7, 12, 2);

            _test(45, 3253, 7);

            for (let i = 1; i <= 500; ++i) {
                const negative = Math.random() > 0.5 ? -1 : 1;

                const start = Math.floor(Math.random() * 20_000 - 10_000);
                const end = start + negative * Math.floor(Math.random() * 20_000);
                let step = negative * Math.floor(Math.random() * 1_000);
                if (step === 0) step = negative; // Step can't be 0

                _test(start, end, step);
            }

            for (let i = 1; i <= 500; ++i) {
                const negative = Math.random() > 0.5 ? -1 : 1;

                const start = Math.random() * 10_000;
                const end = start + negative * Math.random() * 10_000;
                let step = negative * Math.random() * 1_000;
                if (step === 0) step = negative; // Step can't be 0

                _test(start, end, step);
            }
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

            const _test = (min: number, max: number, length: number) => {
                const name = `Min ${formatNumber(min)} Max ${formatNumber(max)} Length ${formatNumber(length)}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.integers(length, min, max);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.be.a("number");
                        expect(val).to.satisfy(Number.isInteger);
                        expect(val).to.be.at.least(min);
                        expect(val).to.be.at.most(max);
                    });

                    console.log("Test passed!\n");
                });
            }

            _test(0, 0, 1);

            _test(1, 10, 3);

            _test(7, 12, 3);

            _test(45, 3253, 3);

            _test(-100, 100, 234);

            for (let i = 1; i <= 500; ++i) {
                const min = Math.floor(Math.random() * 1_000_000 - 500_000);
                const max = min + Math.floor(Math.random() * 1_000_000);
                const length = biasRandom(10_000, 1, 10);

                _test(min, max, length);
            }
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

            const _test = (min: number, max: number, length: number) => {
                const name = `Min ${formatNumber(min)} Max ${formatNumber(max)} Length ${formatNumber(length)}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.decimals(length, min, max);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.be.a("number");
                        expect(val).to.be.at.least(min);
                        expect(val).to.be.at.most(max);
                    });

                    console.log("Test passed!\n");
                });
            }

            _test(0, 0, 1);

            for (let i = 1; i <= 500; ++i) {
                const min = Math.random() * 20_000 - 10_000;
                const max = min + Math.random() * 20_000;
                const length = biasRandom(10_000, 1, 10);

                _test(min, max, length);
            }
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

            const _test = (minLength: number, maxLength: number, length: number, specialChars: boolean) => {
                const name = `Min ${formatNumber(minLength)} Max ${formatNumber(maxLength)} Length ${formatNumber(length)} Special chars ${specialChars}`;
                test(name, function() {

                    console.log(`Running test: ${name}`);

                    TestTimer.startTest(getPath(this));
                    const arr = GenerateArray.strings(length, minLength, maxLength, specialChars);
                    TestTimer.stopTest();

                    console.log(`Test completed, result: ${printOutput(arr)}`);

                    expect(arr).to.be.an("array");
                    expect(arr.length).to.equal(length);
                    arr.forEach((val) => {
                        expect(val).to.be.a("string");
                        expect(val.length).to.be.at.least(minLength);
                        expect(val.length).to.be.at.most(maxLength);
                        if (specialChars) {
                            expect(val).to.match(/[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@\[\]\\^_`{|}~]/);
                        } else {
                            expect(val).to.match(/[a-zA-Z0-9]/);
                        }
                    });

                    console.log("Test passed!\n");
                });
            }

            _test(1, 1, 1, false);

            for (let i = 1; i <= 500; ++i) {
                const minLength = Math.floor(Math.random() * 100) + 1;
                const maxLength = minLength + Math.floor(Math.random() * 1_000);
                const length = biasRandom(10_000, 1, 10);
                const specialChars = Math.random() > 0.5;

                _test(minLength, maxLength, length, specialChars);
            }
        });
    });
});
