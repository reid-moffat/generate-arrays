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
                expect(() => GenerateArray.weightedGenerators(1.2, validWeightedGenerators)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.weightedGenerators(0, validWeightedGenerators)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.weightedGenerators(1, validWeightedGenerators);
                expect(arr.length).to.equal(1);
                expect(arr[0]).to.be.an("number");
            });

            test("Length 3 Depth 3", () => {
                const arr = GenerateArray.weightedGenerators(3, validWeightedGenerators);
                expect(arr.length).to.equal(3);
                expect(arr[0]).to.be.an("number");
                expect(arr[1]).to.be.an("number");
                expect(arr[2]).to.be.an("number");
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
                expect(() => GenerateArray.fixedCountGenerators(1.2, validCountedGenerators)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(0, validCountedGenerators)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Depth not an integer", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, validCountedGenerators)).to.throw("Total count of all generators must equal the length of the array (1): count '12' is invalid");
            });

            test("Depth less than 1", () => {
                expect(() => GenerateArray.fixedCountGenerators(1, validCountedGenerators)).to.throw("Total count of all generators must equal the length of the array (1): count '12' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1 Depth 1", () => {
                const arr = GenerateArray.fixedCountGenerators(12, validCountedGenerators);
                expect(arr.length).to.equal(12);
                arr.forEach((value) => {
                    expect(value).to.be.an("number");
                    expect(value).to.be.within(0, 3);
                });
            });
        });
    });
});
