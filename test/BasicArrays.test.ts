import { GenerateArray } from "../src/index.ts";
import { expect } from "chai";
import { TestTimer, TestPath } from "./utils/TestTimer.ts";
import GenerateArrayError from "../src/GenerateArrayError.ts";

suite("Basic array functions", () => {

    suite("Blank array", () => {

        suite("Invalid input", () => {

            const _test = (name: string, length: any) => {
                test(name, () => {
                    const path: TestPath = {
                        namespace: "Basic functions",
                        method: "Blank array",
                        type: "Invalid",
                        name: name
                    };

                    let err;
                    try {
                        TestTimer.start(path);
                        GenerateArray.blank(length);
                    } catch (e: any) {
                        TestTimer.stop();
                        err = e;
                    }

                    const message = Number.isInteger(length)
                        ? `Parameter 'length' must be at least 1: value '${length}' is invalid`
                        : `Parameter 'length' must be an integer: value '${length}' is invalid`;

                    expect(err).to.be.an.instanceOf(GenerateArrayError);
                    expect(err.message).to.be.a("string");
                    expect(err.message).to.equal(message);
                });
            }

            _test("Length 1.7",1.7);

            _test("Length 1.7",1.7);

            _test("Length 1.7",1.7);

            _test("Length 1.7",1.7);

            test("Length not an integer", () => {
                expect(() => GenerateArray.blank(1.2)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.blank(0)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });

            test("Negative length", () => {
                expect(() => GenerateArray.blank(-7)).to.throw("Parameter 'length' must be at least 1: value '-7' is invalid");
            });
        })

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.blank(1);
                expect(arr).to.deep.equal([undefined]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.blank(3);
                expect(arr).to.deep.equal([undefined, undefined, undefined]);
            });

            test("Length 100", () => {
                const arr = GenerateArray.blank(100);
                expect(arr.length).to.equal(100);
                arr.forEach((val) => {
                    expect(val).to.be.undefined;
                });
            });
        });
    });

    suite("Uniform array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.uniform(1.2, 7)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.uniform(0, 7)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Value 1 Length 1", () => {
                const arr = GenerateArray.uniform(1, 1);
                expect(arr).to.deep.equal([1]);
            });

            test("Value 7 Length 3", () => {
                const arr = GenerateArray.uniform(3, 7);
                expect(arr).to.deep.equal([7, 7, 7]);
            });

            test("Value [1, 2, 3] Length 3", () => {
                const arr = GenerateArray.uniform(3, [1, 2, 3]);
                expect(arr).to.deep.equal([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
            });

            test("Value [1, 2, 3] Length 1", () => {
                const arr = GenerateArray.uniform(1, [1, 2, 3]);
                expect(arr).to.deep.equal([[1, 2, 3]]);
            });
        });
    });

    suite("Custom array", () => {

        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.custom(() => 1, 1.2)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.custom(() => 1, 0)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
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

        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.counting(1, 7);
                expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
            });

            test("Length 3", () => {
                const arr = GenerateArray.counting(3, 4);
                expect(arr).to.deep.equal([3, 4]);
            });

            test("Reverse 7 to 3", () => {
                const arr = GenerateArray.counting(7, 2, 2, true);
                expect(arr).to.deep.equal([7, 5, 3]);
            });
        });
    });

    suite("Integer array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.integers(1.2)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.integers(0)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.integers(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.satisfy((num: number) => Number.isInteger(num));
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(100);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.integers(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.satisfy((num: number) => Number.isInteger(num));
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(100);
                });
            });
        });
    });

    suite("Decimal array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.decimals(1.2)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.decimals(0)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.decimals(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(1);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.decimals(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("number");
                    expect(val).to.be.at.least(0);
                    expect(val).to.be.lessThan(1);
                });
            });
        });
    });

    suite("Strings array", () => {
        suite("Invalid input", () => {
            test("Length not an integer", () => {
                expect(() => GenerateArray.strings(1.2)).to.throw("Parameter 'length' must be an integer: value '1.2' is invalid");
            });

            test("Length less than 1", () => {
                expect(() => GenerateArray.strings(0)).to.throw("Parameter 'length' must be at least 1: value '0' is invalid");
            });
        });

        suite("Valid input", () => {
            test("Length 1", () => {
                const arr = GenerateArray.strings(1);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(1);
                arr.forEach((val) => {
                    expect(val).to.be.a("string");
                    expect(val.length).to.be.at.least(1);
                    expect(val.length).to.be.at.most(10);
                });
            });

            test("Length 3", () => {
                const arr = GenerateArray.strings(3);
                expect(arr).to.be.an("array");
                expect(arr.length).to.equal(3);
                arr.forEach((val) => {
                    expect(val).to.be.a("string");
                    expect(val.length).to.be.at.least(1);
                    expect(val.length).to.be.at.most(10);
                });
            });
        });
    });

});
