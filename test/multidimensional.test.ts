import MultidimensionalArray from "../src/multidimensional.ts";

suite("Multi-dimensional array test", () => {

    suite("Empty base array", () => {

        test("Length 0 Depth 1", () => {
            const arr = MultidimensionalArray.empty(0, 1);
            console.log(arr);
        });

        test("", () => {
            const arr = MultidimensionalArray.empty(3, 3);
            console.log(arr);
        });
    });

});
