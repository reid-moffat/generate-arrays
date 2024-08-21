import { integer, decimal, string, boolean, date, phone, uuid, ipAddress, email, url, name } from "../src/index.ts";
import { expect } from "chai";
import {
    ArrayLengthParameter,
    BooleanParameter,
    NumberParameter,
    TestFailureParams,
    TestFailures
} from "./utils/TestFailures.ts";
import { getPath, printOutput } from "./utils/Utils.ts";
import SuiteMetrics from "suite-metrics";

const TestTimer = SuiteMetrics.getInstance();

suite("Generators", () => {

    suite("integer", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: integer,
            parameters: [
                new NumberParameter({ name: "min", integer: true, optional: true }),
                new NumberParameter({ name: "max", integer: true, optional: true })
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (min: number, max: number) => {
                test(`Min: ${min}, max: ${max}`, () => {

                    console.log(`Running test: Min: ${min}, max: ${max}`);

                    TestTimer.startTest(getPath(this).concat(`Min: ${min}, max: ${max}`));
                    const value = integer(min, max)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("number", "Value is not a number");
                    expect(value).to.satisfy(Number.isInteger, "Value is not an integer");
                    expect(value).to.be.at.least(min, "Value is less than min");
                    expect(value).to.be.at.most(max, "Value is greater than max");
                    console.log("Verified successfully!\n");
                });
            }

            _test(0, 10);

            _test(-10, 0);

            _test(-10, 10);

            _test(0, 0);

            _test(-1, -1);

            for (let i = 0; i < 100; ++i) {
                const min = Math.floor(Math.random() * 100);
                const max = min + Math.floor(Math.random() * 100);
                _test(min, max);
            }

            for (let i = 0; i < 100; ++i) {
                const min = -Math.floor(Math.random() * 100_000_000);
                const max = Math.floor(Math.random() * 100_000_000);
                _test(min, max);
            }
        });
    });

    suite("decimal", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: decimal,
            parameters: [
                new NumberParameter({ name: "min", optional: true }),
                new NumberParameter({ name: "max", optional: true }),
                new NumberParameter({ name: "precision", integer: true, min: 0, optional: true })
            ]
        };
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (min: number, max: number, precision: number) => {
                test(`Min: ${min}, max: ${max}, precision: ${precision}`, () => {

                    console.log(`Running test: Min: ${min}, max: ${max}, precision: ${precision}`);

                    TestTimer.startTest(getPath(this).concat(`Min: ${min}, max: ${max}, precision: ${precision}`));
                    const value = decimal(min, max, precision)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("number", "Value is not a number");
                    expect(value).to.be.at.least(min, "Value is less than min");
                    expect(value).to.be.at.most(max, "Value is greater than max");
                    expect((value.toString().split('.')[1] ?? '').length)
                        .to.be.at.most(precision, "Value has more precision than expected"); // May have zeros at end, so less digits is ok
                    console.log("Verified successfully!\n");
                });
            }

            _test(0, 10, 2);

            _test(-10, 0, 5);

            _test(-10, 10, 3);

            _test(0, 0, 0);

            _test(-1, -1, 0);

            for (let i = 0; i < 100; ++i) {
                const min = Math.floor(Math.random() * 100);
                const max = min + Math.floor(Math.random() * 100);
                const precision = Math.floor(Math.random() * 10);

                _test(min, max, precision);
            }

            for (let i = 0; i < 100; ++i) {
                const min = -Math.random() * 100_000_000;
                const max = Math.random() * 100_000_000;
                const precision = Math.floor(Math.random() * 10);

                _test(min, max, precision);
            }
        });
    });

    suite("string", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: string,
            parameters: [
                new ArrayLengthParameter("length", true),
                new BooleanParameter({ name: "specialChars", optional: true })
            ]
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (length: number | [number, number], specialChars: boolean = false) => {
                const testName = `Length: ${printOutput(length)}, specialChars: ${specialChars}`;
                test(testName, () => {

                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this).concat(testName));
                    const value = string(length, specialChars)();
                    TestTimer.stopTest();

                    console.log(`Result: ${printOutput(value)}`);
                    expect(value).to.be.a("string", "Value is not a string");

                    if (Array.isArray(length)) {
                        expect(value).to.have.lengthOf.at.least(length[0], "Value is shorter than min length");
                        expect(value).to.have.lengthOf.at.most(length[1], "Value is longer than max length");
                    } else {
                        expect(value).to.have.lengthOf(length, "Value has incorrect length");
                    }

                    if (!specialChars) {
                        expect(value).to.match(/^[0-9a-zA-Z]*$/, "Value contains special characters");
                    }

                    console.log("Verified successfully!\n");
                });
            }

            _test(1);

            _test(10);

            _test([5, 10]);

            _test([1, 8]);

            _test([1, 1]);

            for (let i = 0; i < 500; ++i) {
                const length = Math.floor(Math.random() * 100) + 1;
                const specialChars = Math.random() < 0.5;
                _test(length, specialChars);
            }

            for (let i = 0; i < 100; ++i) {
                const min = Math.floor(Math.random() * 100_000) + 1;
                const max = min + Math.floor(Math.random() * 100_000);
                const specialChars = Math.random() < 0.5;
                _test([min, max], specialChars);
            }
        });
    });

    suite("boolean", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: boolean,
            parameters: [
                new NumberParameter({ name: "trueChance", min: 0, max: 1, optional: true })
            ]
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = boolean();
            expect(gen()).to.be.a("boolean");
        });
    });

    suite("date", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: date,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = date();
            expect(gen()).to.be.a("date");
        });
    });

    suite("phone", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: phone,
            parameters: [
                new BooleanParameter({ name: "countryCode", optional: true }),
                new BooleanParameter({ name: "format", optional: true })
            ]
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = phone();
            expect(gen()).to.be.a("string");
        });
    });

    suite("uuid", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: uuid,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = uuid();
            expect(gen()).to.be.a("string");
        });
    });

    suite("ipAddress", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ipAddress,
            parameters: [
                new BooleanParameter({name: "IPv4", optional: true})
            ]
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = ipAddress();
            expect(gen()).to.be.a("string");
        });
    });

    suite("email", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: email,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = email();
            expect(gen()).to.be.a("string");
        });

    });

    suite("url", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: url,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = url();
            expect(gen()).to.be.a("string");
        });
    });

    suite("name", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: name,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", () => {
            const gen = name();
            expect(gen()).to.be.a("string");
        });
    });

});
