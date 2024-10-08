import { integer, decimal, string, boolean, date, phone, uuid, ipAddress, email, url, word, name } from "../src/functions/Generators.ts";
import { expect } from "chai";
import {
    ArrayLengthParameter,
    BooleanParameter,
    NumberParameter,
    TestFailureParams,
    TestFailures
} from "./utils/TestFailures.ts";
import { getPath, log, printOutput } from "./utils/Utils.ts";
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

                    log(`Running test: Min: ${min}, max: ${max}`);

                    TestTimer.startTest(getPath(this));
                    const value = integer(min, max)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("number", "Value is not a number");
                    expect(value).to.satisfy(Number.isInteger, "Value is not an integer");
                    expect(value).to.be.at.least(min, "Value is less than min");
                    expect(value).to.be.at.most(max, "Value is greater than max");
                    log("Verified successfully!\n");
                });
            }

            _test(0, 10);

            _test(-10, 0);

            _test(-10, 10);

            _test(0, 0);

            _test(-1, -1);

            for (let i = 0; i < 200; ++i) {
                const min = Math.floor(Math.random() * 100);
                const max = min + Math.floor(Math.random() * 100);
                _test(min, max);
            }

            for (let i = 0; i < 200; ++i) {
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

                    log(`Running test: Min: ${min}, max: ${max}, precision: ${precision}`);

                    TestTimer.startTest(getPath(this));
                    const value = decimal(min, max, precision)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("number", "Value is not a number");
                    expect(value).to.be.at.least(min, "Value is less than min");
                    expect(value).to.be.at.most(max, "Value is greater than max");
                    expect((value.toString().split('.')[1] ?? '').length)
                        .to.be.at.most(precision, "Value has more precision than expected"); // May have zeros at end, so less digits is ok
                    log("Verified successfully!\n");
                });
            }

            _test(0, 10, 2);

            _test(-10, 0, 5);

            _test(-10, 10, 3);

            _test(0, 0, 0);

            _test(-1, -1, 0);

            for (let i = 0; i < 200; ++i) {
                const min = Math.floor(Math.random() * 100);
                const max = min + Math.floor(Math.random() * 100);
                const precision = Math.floor(Math.random() * 10);

                _test(min, max, precision);
            }

            for (let i = 0; i < 200; ++i) {
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

                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = string(length, specialChars)();
                    TestTimer.stopTest();

                    log(`Result: ${printOutput(value)}`);
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

                    log("Verified successfully!\n");
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
                    log(`Running test: True chance: ${trueChance}`);

                    TestTimer.startTest(getPath(this));
                    const value = boolean(trueChance)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("boolean", "Value is not a boolean");
                    if (expected !== undefined) {
                        expect(value).to.equal(expected, "Value does not match expected");
                    } else {
                        expect(value).to.be.oneOf([true, false], "Value is not true or false");
                    }
                    log("Verified successfully!\n");
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
                    log(`Running randomness test: ${testName}`);

                    let numTrue = 0;
                    const gen = boolean(chance);
                    for (let i = 0; i < iterations; ++i) {
                        const value = gen();
                        if (typeof value !== "boolean") throw new Error("Value is not a boolean");

                        numTrue += value ? 1 : 0;
                    }

                    const expectedTrue = iterations * chance;
                    expect(numTrue).to.be.closeTo(expectedTrue, iterations * error);
                    log("Verified successfully!\n");
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
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = date(min, max)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("Date", "Value is not a Date");
                    expect(value.getTime()).to.be.at.least(typeof min === 'number' ? min : min.getTime(), "Value is before min");
                    expect(value.getTime()).to.be.at.most(typeof max === 'number' ? max : max.getTime(), "Value is after max");
                    log("Verified successfully!\n");
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
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = phone(countryCode, format)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
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

                    log("Verified successfully!\n");
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
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = uuid()();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");
                    expect(value).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, "Value does not match UUID format");
                    log("Verified successfully!\n");
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

            const _test = (IPv6: boolean = false, mask: boolean = false) => {
                const testName = `${IPv6 ? "IPv6" : "IPv4"}${mask ? " with mask" : ""}`;
                test(testName, function() {
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = ipAddress(IPv6, mask)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");

                    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                    const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}:$|^(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}$|^(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}$|^(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}$|^(?:[a-fA-F0-9]{1,4}:){1,6}::$|^(?:[a-fA-F0-9]{1,4}:):(?:[a-fA-F0-9]{1,4}:){1,7}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}[a-fA-F0-9]{1,4}$/;

                    const ipv4CidrRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))$/;
                    const ipv6CidrRegex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))$|^(?:[a-fA-F0-9]{1,4}:){1,7}:(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))$/;

                    if (IPv6 && mask) {
                        expect(value).to.match(ipv6CidrRegex, "Value does not match IPv6 CIDR format");
                    } else if (IPv6 && !mask) {
                        expect(value).to.match(ipv6Regex, "Value does not match IPv6 format");
                    } else if (!IPv6 && mask) {
                        expect(value).to.match(ipv4CidrRegex, "Value does not match IPv4 CIDR format");
                    } else {
                        expect(value).to.match(ipv4Regex, "Value does not match IPv4 format");
                    }

                    log("Verified successfully!\n");
                });
            }

            _test();

            _test(true);

            _test(false);

            for (let i = 0; i < 500; ++i) {
                const IPv6 = Math.random() < 0.5;
                const mask = Math.random() < 0.5;
                _test(IPv6, mask);
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

        suite("Valid input", function() {

            let testNum = 1;
            const _test = (rngUsername?: number | [number, number]) => {
                const testName = `Test #${testNum++}`;
                test(testName, function() {
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = email(rngUsername)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");
                    if (rngUsername) {
                        const username = value.split('@')[0];
                        if (Array.isArray(rngUsername)) {
                            expect(username.length).to.be.at.least(rngUsername[0], "Value is shorter than min length");
                            expect(username.length).to.be.at.most(rngUsername[1], "Value is longer than max length");
                        } else {
                            expect(username.length).to.equal(rngUsername, "Value does not match expected length");
                        }
                    } else {
                        expect(value).to.match(/^[0-9a-zA-Z]+\.[0-9a-zA-Z]+@[0-9a-zA-Z]+\.[a-zA-Z]+$/, "Value does not match email format");
                    }
                    log("Verified successfully!\n");
                });
            }

            _test();

            for (let i = 0; i < 1000; ++i) {
                const rngUsername: undefined | number | [number, number] = Math.random() < 0.5
                    ? undefined
                    : Math.random() < 0.5
                        ? Math.floor(Math.random() * 10) + 5
                        : [Math.floor(Math.random() * 1000) + 5, Math.floor(Math.random() * 1000) + 5];
                if (Array.isArray(rngUsername) && rngUsername[0] > rngUsername[1]) {
                    const temp = rngUsername[0];
                    rngUsername[0] = rngUsername[1];
                    rngUsername[1] = temp;
                }

                _test(rngUsername);
            }
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

    suite("word", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: word,
            parameters: []
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            let testNum = 1;
            const _test = (capitalize: boolean = false) => {
                const testName = `Test #${testNum++}`;
                test(testName, function() {
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = word(capitalize)();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");
                    if (capitalize) {
                        expect(value).to.match(/^[A-Z][a-z]+$/, "Value does not match capitalized word format");
                    } else {
                        expect(value).to.match(/^[a-z]+$/, "Value contains non-alphabet characters");
                    }
                    log("Verified successfully!\n");
                });
            }

            for (let i = 0; i < 1000; ++i) {
                const capitalize = Math.random() < 0.5;
                _test(capitalize);
            }
        });
    });

    suite("name", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: name,
            parameters: []
        }
        TestFailures.run(failureTestData);

        suite("Valid input", function() {

            let testNum = 1;
            const _test = () => {
                const testName = `Test #${testNum++}`;
                test(testName, function() {
                    log(`Running test: ${testName}`);

                    TestTimer.startTest(getPath(this));
                    const value = name()();
                    TestTimer.stopTest();

                    log(`Result: ${value}`);
                    expect(value).to.be.a("string", "Value is not a string");
                    expect(value).to.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/, "Value does not match name format");
                    log("Verified successfully!\n");
                });
            }

            for (let i = 0; i < 1000; ++i) {
                _test();
            }
        });
    });

});
