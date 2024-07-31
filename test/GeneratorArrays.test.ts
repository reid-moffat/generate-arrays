import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";

suite("Generator array functions", () => {

    suite("Equal chances", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.generators(1.2, 1)).to.throw("Array length must be an integer: value '1.2' is" +
                    " invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.generators(0, 1)).to.throw("Array length must be greater than 0 to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.generators(1, 1.2)).to.throw("Array depth must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.generators(1, 0)).to.throw("Array depth must be at least 1 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.generators(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.generators(3, 3);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });

    suite("Weighted chances", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.weightedGenerators(1.2, 1)).to.throw("Array length must be an integer: value '1.2' is" +
                    " invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.weightedGenerators(0, 1)).to.throw("Array length must be greater than 0 to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.weightedGenerators(1, 1.2)).to.throw("Array depth must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.weightedGenerators(1, 0)).to.throw("Array depth must be at least 1 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.weightedGenerators(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.weightedGenerators(3, 3);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });

    suite("Fixed count", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.fixedCountGenerators(1.2, 1)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(0, 1)).to.throw("Array length must be greater than 0 to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, 1.2)).to.throw("Array depth must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, 0)).to.throw("Array depth must be at least 1 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.fixedCountGenerators(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.fixedCountGenerators(3, 3);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });
});
