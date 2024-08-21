import { integer, decimal, string, boolean, date, phone, uuid, ipAddress, email, url, name } from "../src/index.ts";
import { expect } from "chai";
import {
    ArrayLengthParameter,
    BooleanParameter,
    NumberParameter,
    TestFailureParams,
    TestFailures
} from "./utils/TestFailures.ts";
import { getPath } from "./utils/Utils.ts";
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

                    TestTimer.startTest(getPath(this).concat(`Min: ${min}, max: ${max}`));
                    const value = integer(min, max)();
                    TestTimer.stopTest();

                    expect(value).to.be.a("number", "Value is not a number");
                    expect(value).to.satisfy(Number.isInteger, "Value is not an integer");
                    expect(value).to.be.at.least(min, "Value is less than min");
                    expect(value).to.be.at.most(max, "Value is greater than max");
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

        test("default", () => {
            const gen = decimal();
            expect(gen()).to.be.a("string");
        });
        test("min", () => {
            const gen = decimal(10);
            expect(parseFloat(gen())).to.be.at.least(10);
        });
        test("max", () => {
            const gen = decimal(0, 10);
            expect(parseFloat(gen())).to.be.at.most(10);
        });
        test("precision", () => {
            const gen = decimal(0, 10, 2);
            expect(gen()).to.match(/\d+\.\d{2}/);
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

        test("default", () => {
            const gen = string();
            expect(gen()).to.be.a("string");
        });
        test("length", () => {
            const gen = string(10);
            expect(gen()).to.have.lengthOf(10);
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
