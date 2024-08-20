import { integer, decimal, string, boolean, date, phone, uuid, ipAddress, email, url, name } from "../src/index.ts";
import { expect } from "chai";
import { BooleanParameter, NumberParameter, TestFailureParams, TestFailures } from "./Utils/TestFailures.ts";
import { getPath } from "./Utils/Utils.ts";

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

        test("default", () => {
            const gen = integer();
            expect(gen()).to.be.a("number");
        });
        test("min", () => {
            const gen = integer(10);
            expect(gen()).to.be.at.least(10);
        });
        test("max", () => {
            const gen = integer(0, 10);
            expect(gen()).to.be.at.most(10);
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
                new NumberParameter({ name: "length", integer: true, optional: true }),
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

});
