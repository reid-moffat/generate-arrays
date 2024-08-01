import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";

suite("Multi-dimensional array functions", () => {

    suite("Empty base array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.emptyND(1.2, 1)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.emptyND(0, 1)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.emptyND(1, 1.2)).to.throw("Parameter 'depth' must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.emptyND(1, 0)).to.throw("Parameter 'depth' must be at least 2: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 2", () => {
                const arr = GenerateArray.emptyND(1, 2);
                expect(arr).to.deep.equal([[]]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.emptyND(3, 3);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });

    suite("Uniform base array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.uniformND(7, 1.2, 1)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.uniformND(7, 0, 1)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.uniformND(7, 1, 1.2)).to.throw("Parameter 'depth' must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.uniformND(7, 1, 0)).to.throw("Parameter 'depth' must be at least 2: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Value 7 Length 1 Depth 2", () => {
                const arr = GenerateArray.uniformND(7, 1, 2);
                expect(arr).to.deep.equal([[7]]);
            });

            test("Value 7 Length 3 Depth 1", () => {
                const arr = GenerateArray.uniformND(7, 3, 2);
                expect(arr).to.deep.equal([[7], [7], [7]]);
            });

            test("Value [1, 2, 3] Length 3 Depth 1", () => {
                const arr = GenerateArray.uniformND([1, 2, 3], 3, 2);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value 7 Length 3 Depth 2", () => {
                const arr = GenerateArray.uniformND(7, 3, 2);
                expect(arr).to.deep.equal([[7], [7], [7]]);
            });

            test("Value [1, 2, 3] Length 3 Depth 2", () => {
                const arr = GenerateArray.uniformND([1, 2, 3], 3, 2);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });
        });
    });

    suite("Custom base array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.customND(() => [1, 2, 3], 1.2, 1)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.customND(() => [1, 2, 3], 0, 1)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.customND(() => [1, 2, 3], 1, 1.2)).to.throw("Parameter 'depth' must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.customND(() => [1, 2, 3], 1, 0)).to.throw("Parameter 'depth' must be at least 2: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Value [1, 2, 3] Length 1 Depth 2", () => {
                const arr = GenerateArray.customND(() => [1, 2, 3], 1, 2);
                expect(arr).to.deep.equal([[1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 3 Depth 2", () => {
                const arr = GenerateArray.customND(() => [1, 2, 3], 3, 2);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 4 Depth 2", () => {
                const arr = GenerateArray.customND(() => [1, 2, 3], 4, 2);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });
        });
    });

});
