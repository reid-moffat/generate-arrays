import MultidimensionalArray from "../src/multidimensional.ts";
import { expect } from "chai";

suite("Multi-dimensional array test", () => {

    suite("Empty base array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => MultidimensionalArray.empty(1.2, 1)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => MultidimensionalArray.empty(0, 1)).to.throw("Array length must be greater than 0 to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => MultidimensionalArray.empty(1, 1.2)).to.throw("Array depth must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => MultidimensionalArray.empty(1, 0)).to.throw("Array depth must be at least 1 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = MultidimensionalArray.empty(1, 1);
                expect(arr).to.deep.equal([]);
            });

            test("Length 3 Depth 3", () => {
                const arr = MultidimensionalArray.empty(3, 3);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });

});
