import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";

suite("Generator array functions", () => {

    suite("Equal chances", () => {

        const validGenerators = [
            () => Math.random(),
            () => Math.floor(Math.random() * 100) + 1
        ];

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.generators(1.2, validGenerators)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length of 0", () => {
                expect(() => GenerateArray.generators(0, validGenerators)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Negative length", () => {
                expect(() => GenerateArray.generators(-7, validGenerators)).to.throw("Parameter 'length' must be at least 1: value '-7' is invalid");
            });

            test("No generators", () => {
                expect(() => GenerateArray.generators(1, [])).to.throw("generators[Math.floor(...)] is not a function");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.generators(1, validGenerators);
                expect(arr.length).to.equal(1);
                expect(arr[0]).to.be.an("number");
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.generators(3, validGenerators);
                expect(arr.length).to.equal(3);
                expect(arr[0]).to.be.an("number");
                expect(arr[1]).to.be.an("number");
                expect(arr[2]).to.be.an("number");
            });
        });
    });

    suite("Weighted chances", () => {

        const validWeightedGenerators = [
            { generator: () => Math.random(), chance: 0.5 },
            { generator: () => Math.random() + 1, chance: 0.14 },
            { generator: () => Math.random() + 2, chance: 0.36 }
        ];

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.weightedGenerators(1.2, validWeightedGenerators)).to.throw("Array length must be an integer:" +
                    " value '1.2' is" +
                    " invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.weightedGenerators(0, validWeightedGenerators)).to.throw("Array length must be greater than 0" +
                    " to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.weightedGenerators(1, validWeightedGenerators)).to.throw("Array depth must be an integer:" +
                    " value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.weightedGenerators(1, validWeightedGenerators)).to.throw("Array depth must be at least 1 to" +
                    " generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.weightedGenerators(1, validWeightedGenerators);
                expect(arr).to.deep.equal([1]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.weightedGenerators(3, validWeightedGenerators);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });

    suite("Fixed count", () => {

        const validCountedGenerators = [
            { generator: () => Math.random(), count: 2 },
            { generator: () => Math.random() + 1, count: 7 },
            { generator: () => Math.random() + 2, count: 3 }
        ];

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.fixedCountGenerators(1.2, validCountedGenerators)).to.throw("Array length must be an integer:" +
                    " value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(0, validCountedGenerators)).to.throw("Array length must be greater than" +
                    " 0 to generate array");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, validCountedGenerators)).to.throw("Array depth must be an integer: value '1.2' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, validCountedGenerators)).to.throw("Array depth must be at least 1 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.fixedCountGenerators(1, validCountedGenerators);
                expect(arr).to.deep.equal([1]);
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.fixedCountGenerators(3, validCountedGenerators);
                expect(arr.length).to.equal(3);
                expect(arr[0].length).to.equal(3);
                // @ts-ignore
                expect(arr[0][0].length).to.equal(0);
                expect(arr).to.deep.equal([[[], [], []], [[], [], []],[[], [], []]]);
            });
        });
    });
});
