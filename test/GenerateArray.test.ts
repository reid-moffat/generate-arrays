import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";

suite("GenerateArray test", () => {

    suite("Blank array", () => {

    });

    suite("Uniform array", () => {

    });

    suite("Custom array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.custom(() => 1, 1.2)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.custom(() => 1, 0)).to.throw("Array length must be greater than 0 to generate array");
            });
        });

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

});
