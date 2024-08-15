import { integer, decimal, string } from "../src/index.ts";
import { expect } from "chai";
import { NumberParameter, TestFailureParams, TestFailures } from "./Utils/TestFailures.ts";
import { getPath } from "./Utils/Utils.ts";

suite("Generators", () => {

    suite("integer", function() {

        const failureTestData: TestFailureParams = {
            path: getPath(this),
            func: integer,
            parameters: [
                new NumberParameter("min", true, undefined, undefined, true),
                new NumberParameter("max", true, undefined, undefined, true)
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
                new NumberParameter("min", false, undefined, undefined, true),
                new NumberParameter("max", false, undefined, undefined, true),
                new NumberParameter("precision", true, 0, undefined, true)
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

    suite("string", () => {
        test("default", () => {
            const gen = string();
            expect(gen()).to.be.a("string");
        });
        test("length", () => {
            const gen = string(10);
            expect(gen()).to.have.lengthOf(10);
        });
    });

});
