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

suite("Generators", function() {

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
                test(`Min: ${min}, max: ${max}`, function() {

                    console.log(`Running test: Min: ${min}, max: ${max}`);

                    TestTimer.startTest(getPath(this));
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
                test(`Min: ${min}, max: ${max}, precision: ${precision}`, function() {

                    console.log(`Running test: Min: ${min}, max: ${max}, precision: ${precision}`);

                    TestTimer.startTest(getPath(this));
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
                test(testName, function() {

                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
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

        suite("Valid input", function() {

            const _test = (trueChance: number, expected?: boolean) => {
                test(`True chance: ${trueChance}`, function() {
                    console.log(`Running test: True chance: ${trueChance}`);

                    TestTimer.startTest(getPath(this));
                    const value = boolean(trueChance)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("boolean", "Value is not a boolean");
                    if (expected !== undefined) {
                        expect(value).to.equal(expected, "Value does not match expected");
                    } else {
                        expect(value).to.be.oneOf([true, false], "Value is not true or false");
                    }
                    console.log("Verified successfully!\n");
                });
            }

            for (let i = 0; i < 100; ++i) {
                _test(0, false);
                _test(1, true);
            }

            for (let i = 0; i < 100; ++i) {
                const trueChance = Math.random();
                _test(trueChance);
            }

            const _testChance = (chance: number, iterations: number = 100_000, error: number = 0.02) => {
                const testName = `Chance: ${chance}, iterations: ${iterations}, error: ${error}`;

                test(testName, function() {
                    console.log(`Running randomness test: ${testName}`);

                    let numTrue = 0;
                    const gen = boolean(chance);
                    for (let i = 0; i < iterations; ++i) {
                        const value = gen();
                        if (typeof value !== "boolean") throw new Error("Value is not a boolean");

                        numTrue += value ? 1 : 0;
                    }

                    const expectedTrue = iterations * chance;
                    expect(numTrue).to.be.closeTo(expectedTrue, iterations * error);
                    console.log("Verified successfully!\n");
                });
            }

            for (let i = 0; i < 100; ++i) {
                _testChance(Math.random());
            }
        });
    });

    suite("date", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: date,
            parameters: []
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (min: Date | number = new Date(0), max: Date | number = new Date()) => {
                const testName = `Min: ${new Date(min).toISOString()}, max: ${new Date(max).toISOString()}`;
                test(testName, function() {
                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = date(min, max)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("Date", "Value is not a Date");
                    expect(value.getTime()).to.be.at.least(typeof min === 'number' ? min : min.getTime(), "Value is before min");
                    expect(value.getTime()).to.be.at.most(typeof max === 'number' ? max : max.getTime(), "Value is after max");
                    console.log("Verified successfully!\n");
                });
            }

            _test();

            const maxMillis = 1000 * (Math.pow(2, 31) - 1); // year 2038 problem
            for (let i = 0; i < 100; ++i) {
                const d1 = Math.floor(Math.random() * maxMillis);
                const d2 = Math.floor(Math.random() * maxMillis);

                if (d1 > d2) {
                    _test(d2, d1);
                } else {
                    _test(d1, d2);
                }
            }

            for (let i = 0; i < 100; ++i) {
                const d1 = new Date(Math.floor(Math.random() * maxMillis));
                const d2 = new Date(Math.floor(Math.random() * maxMillis));

                if (d1.getTime() > d2.getTime()) {
                    _test(d2, d1);
                } else {
                    _test(d1, d2);
                }
            }
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

        suite("Valid input", function() {

            const _test = (countryCode: boolean = false, format: boolean = false) => {
                const testName = `Country code: ${countryCode}, format: ${format}`;
                test(testName, function() {
                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = phone(countryCode, format)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");

                    if (countryCode && format) {
                        expect(value).to.match(/^\+?[0-9]{1,3} \([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, "Value does not match expected format");
                    } else if (countryCode && !format) {
                        expect(value).to.match(/^\+?[0-9]{1,3}[0-9]{10}$/, "Value does not match expected format");
                    } else if (!countryCode && format) {
                        expect(value).to.match(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, "Value does not match expected format");
                    } else {
                        expect(value).to.match(/^[0-9]{10}$/, "Value does not match expected format");
                    }

                    console.log("Verified successfully!\n");
                });
            }

            _test();

            _test(true);

            _test(false, true);

            _test(true, true);

            _test(false, false);

            for (let i = 0; i < 200; ++i) {
                const countryCode = Math.random() < 0.5;
                const format = Math.random() < 0.5;
                _test(countryCode, format);
            }
        });
    });

    suite("uuid", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: uuid,
            parameters: []
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            let testNum = 1;
            const _test = () => {
                const testName = `Test #${testNum++}`;
                test(testName, function() {
                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = uuid()();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");
                    expect(value).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Value does not match UUID format");
                    console.log("Verified successfully!\n");
                });
            }

            _test();

            for (let i = 0; i < 1000; ++i) {
                _test();
            }
        });
    });

    suite("ipAddress", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: ipAddress,
            parameters: [
                new BooleanParameter({name: "IPv6", optional: true})
            ]
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            const _test = (IPv6: boolean = false) => {
                const testName = `IPv6: ${IPv6}`;
                test(testName, function() {
                    console.log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = ipAddress(IPv6)();
                    TestTimer.stopTest();

                    console.log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");

                    if (IPv6) {
                        expect(value).to.match(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/, "Value does not match IPv6 format");
                    } else {
                        expect(value).to.match(/^[0-9a-f]{4}(:[0-9a-f]{4}){7}$/, "Value does not match IPv4 format");
                    }

                    console.log("Verified successfully!\n");
                });
            }

            _test();

            _test(true);

            _test(false);

            for (let i = 0; i < 200; ++i) {
                const IPv6 = Math.random() < 0.5;
                _test(IPv6);
            }
        });
    });

    suite("email", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: email,
            parameters: []
        }
        TestFailures.run(failureTestData);

        test("default", function() {
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

        test("default", function() {
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

        test("default", function() {
            const gen = name();
            expect(gen()).to.be.a("string");
        });
    });

});
