/**
 *
 */
class MultidimensionalArray {

    private static _deepArray = (baseArray: any[], length: number, depth: number): any[] => {
        if (depth === 1) {
            return baseArray;
        }

        return Array.from({ length }, () => this._deepArray(baseArray, length, depth - 1));
    }

    /**
     * Generates an array of arrays of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where the base array is empty.
     *
     * Examples:
     * MultidimensionalArray.empty(7, 1) -> [] (Depth of 1, so no nested arrays are generated regardless of length)
     * MultidimensionalArray.empty(1, 2) -> [[]] (Each array has 1 array in it, and there are 2 levels of arrays)
     * MultidimensionalArray.empty(2, 2) -> [[], []] (Each array has 2 arrays in it, and there are 2 levels of arrays)
     * MultidimensionalArray.empty(1, 3) -> [[[]]] (There is 1 array in each array, and 3 levels of arrays)
     * MultidimensionalArray.empty(2, 3) -> [[[], []], [[], []]] (There are 2 arrays in each array, and 3 levels of arrays)
     *
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 1), i.e. how many layers of arrays there are. Note that if depth
     * is 1, the result will always be [] regardless of the value of length as there are no nested arrays.
     */
    public static empty = (length: number, depth: number): [][] => {

        if (!Number.isInteger(length)) {
            throw new GenerateArrayError(`Array length must be an integer: value '${length}' is invalid`);
        }
        if (length < 1) {
            throw new GenerateArrayError("Array length must be greater than 0 to generate array");
        }

        if (!Number.isInteger(depth)) {
            throw new GenerateArrayError(`Array depth must be an integer: value '${depth}' is invalid`);
        }
        if (depth < 1) {
            throw new GenerateArrayError("Array depth must be at least 1 to generate array");
        }

        return this._deepArray([], length, depth);
    }

    /**
     * Generates an array of arrays of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where all base arrays are filled with the given value(s).
     *
     * If the value is an array, the base arrays will be the given array. If the value is not an array, the base arrays
     * will be an array filled with the given value. E.g. 7 -> [7], [1, 2, 3] -> [1, 2, 3]
     *
     * Examples:
     * MultidimensionalArray.uniform(7, 1, 1) -> [7]
     * MultidimensionalArray.uniform(7, 3, 1) -> [7] (Length is irrelevant if depth is 1, as there are no nested arrays)
     * MultidimensionalArray.uniform([1, 2, 3], 3, 1) -> [1, 2, 3]
     * MultidimensionalArray.uniform(7, 3, 2) -> [[7], [7], [7]]
     * MultidimensionalArray.uniform([1, 2, 3], 3, 2) -> [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
     *
     * @param value Value of the base array. If not an array, the base array will be an array filled with this value.
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 1), i.e. how many layers of arrays there are. Note that if depth
     */
    public static uniform = (value: any, length: number, depth: number): any[] => {

        if (!Number.isInteger(length)) {
            throw new GenerateArrayError(`Array length must be an integer: value '${length}' is invalid`);
        }
        if (length < 1) {
            throw new GenerateArrayError("Array length must be greater than 0 to generate array");
        }
        if (!Number.isInteger(depth)) {
            throw new GenerateArrayError(`Array depth must be an integer: value '${depth}' is invalid`);
        }
        if (depth < 1) {
            throw new GenerateArrayError("Array depth must be at least 1 to generate array");
        }

        const baseArray = [];
        if (Array.isArray(value)) {
            baseArray.push(...value);
        } else {
            baseArray.push(value);
        }

        return this._deepArray(baseArray, length, depth);
    }


}

const multidimensional = (arr: any[], depth: number = 1): any[] => {
    if (depth === 1) {
        return arr;
    }
    return Array.from({ length: arr.length }, () => multidimensional(arr, depth - 1));
}

export default MultidimensionalArray;
