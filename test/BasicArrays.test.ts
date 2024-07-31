import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";

suite("Basic array functions", () => {

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

    suite("Counting array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.counting(1.2)).to.throw("Array length must be an integer: value '1.2' is" +
                    " invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.counting(0)).to.throw("Array length must be greater than 0 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.counting(1);
                expect(arr).to.deep.equal([0]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.counting(3);
                expect(arr).to.deep.equal([0, 1, 2]);
            });
        });
    });

    suite("Integer array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.integers(1.2)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.integers(0)).to.throw("Array length must be greater than 0 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.integers(1);
                expect(arr).to.deep.equal([0]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.integers(3);
                expect(arr).to.deep.equal([0, 1, 2]);
            });
        });
    });

    suite("Decimal array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.decimals(1.2)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.decimals(0)).to.throw("Array length must be greater than 0 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.decimals(1);
                expect(arr).to.deep.equal([0]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.decimals(3);
                expect(arr).to.deep.equal([0, 0, 0]);
            });
        });
    });

    suite("Strings array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.strings(1.2)).to.throw("Array length must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.strings(0)).to.throw("Array length must be greater than 0 to generate array");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.strings(1);
                expect(arr).to.deep.equal([""]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.strings(3);
                expect(arr).to.deep.equal(["", "", ""]);
            });
        });
    });

});
