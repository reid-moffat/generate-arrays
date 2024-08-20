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

});
