import Validation from "./Validation.ts";

/**
 *
 */
class MultidimensionalArray {

    private static _deepArray = (baseArray: any[] | (() => any[]), length: number, depth: number): any[] => {
        if (depth === 1) {
            if (typeof baseArray === "function") {
                return baseArray();
            }
            return baseArray.slice();
        }

        return Array.from({ length }, () => this._deepArray(baseArray, length, depth - 1));
    }

    /**
     * Generates an array of arrays of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where the base array is empty.
     *
     * Examples:
     * MultidimensionalArray.empty(1, 2) -> [[]] (Each array has 1 array in it, and there are 2 levels of arrays)
     * MultidimensionalArray.empty(2, 2) -> [[], []] (Each array has 2 arrays in it, and there are 2 levels of arrays)
     * MultidimensionalArray.empty(1, 3) -> [[[]]] (There is 1 array in each array, and 3 levels of arrays)
     * MultidimensionalArray.empty(2, 3) -> [[[], []], [[], []]] (There are 2 arrays in each array, and 3 levels of arrays)
     *
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Depth of 1
     * isn't allowed to reduce confusion as it would just be on empty array ([]) regardless of the length.
     */
    public static empty = (length: number, depth: number): [][] => {

        Validation.integer(length, 1, "length");
        Validation.integer(depth, 2, "depth");

        return this._deepArray([], length, depth);
    }

    /**
     * Generates an array of arrays of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where all base arrays are filled with the given value(s).
     *
     * If the value is an array, the base arrays will be filled with the values of the array instead of adding an
     * extra depth of arrays, e.g. 7 -> [7], [1, 2, 3] -> [1, 2, 3] (put the array in an array if you'd like this)
     *
     * Examples:
     * MultidimensionalArray.uniform(7, 3, 2) -> [[7], [7], [7]]
     * MultidimensionalArray.uniform([1, 2, 3], 3, 2) -> [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
     *
     * @param value Value of the base array. If not an array, the base array will be an array filled with this value.
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Depth of 1
     * isn't included to reduce confusion, as it would just return the value in an array (or the value if it's an array)
     * e.g. MultidimensionalArray.uniform([1, 2, 3], 3, 1) -> [1, 2, 3]
     */
    public static uniform = (value: any, length: number, depth: number): any[] => {

        Validation.integer(length, 1, "length");
        Validation.integer(depth, 2, "depth");

        const baseArray = [];
        if (Array.isArray(value)) {
            baseArray.push(...value);
        } else {
            baseArray.push(value);
        }

        return this._deepArray(baseArray, length, depth);
    }

    /**
     * Generates an array of arrays of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where the base arrays are generated by the given function.
     *
     * Examples:
     * MultidimensionalArray.custom(() => Math.floor(Math.random() * 10), 3, 2) -> [[7], [2], [5]] (possible output)
     *
     * @param arrayGen Function to generate the base array. Note this function is called once for each base array,
     * so to have multiple values, this function should return an array of multiple values (e.g.
     * GenerateArray.custom(() => ..., len))
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Depth of 1 isn't
     * allowed to reduce confusion as it would just put the value of one function call in an array, e.g. () => 7 -> [7]
     * (to get a 1-D array with multiple values, use GenerateArray.custom(() => ..., len) instead)
     */
    public static custom = (arrayGen: () => any[], length: number, depth: number): any[] => {

        Validation.integer(length, 1, "length");
        Validation.integer(depth, 2, "depth");

        return this._deepArray(arrayGen, length, depth);
    }

    private array: any[];

    public MultidimensionalArray(array: any[]) {
        this.array = array;
    }

    /**
     * Returns the array
     */
    public getArray(): any[] {
        return this.array;
    }

    /**
     * Returns the array as a string
     */
    public toString(): string {
        return this.array.toString();
    }

    /**
     * Returns true if the provided MultidimensionalArray is equal to this array
     * @param other
     */
    public equals(other: MultidimensionalArray): boolean {
        return this.array.toString() === other.array.toString();
    }

    /**
     * Returns true if the provided array is equal to this array
     * @param other
     */
    public equalsArray(other: any[]): boolean {
        return this.array.toString() === other.toString();
    }

    /**
     * Multiplies the array within itself n times (i.e. repeats the elements in the array n times)
     *
     * Example:
     * arr = [1, 2] && arr.multiplyLength(3) -> [1, 2, 1, 2, 1, 2]
     *
     * @param factor
     */
    public multiplyLength(factor: number): void {
        this.array = this.array.flatMap(item => Array.from({ length: factor }, () => item));
    }

    /**
     * Makes multiples of the array, placing the result in a new array
     *
     * Example:
     * arr.multiply(3) -> [arr, arr, arr]
     *
     * @param factor Number of times to multiply the array
     */
    public multiplyDimensional(factor: number): void {
        const newArray = [];
        for (let i = 0; i < factor; i++) {
            newArray.push(this.array);
        }
        this.array = newArray;
    }

    /**
     * Adds the specified number of dimensions to the array (i.e. wraps the array in arrays the specified number of times)
     *
     * Example:
     * arr.addDimensions(1) -> [arr]
     * arr.addDimensions(2) -> [[arr]]
     * arr.addDimensions(3) -> [[[arr]]]
     *
     * @param depth
     */
    public addDimensions(depth: number): void {
        this.array = MultidimensionalArray._deepArray(this.array, 1, depth + 1);
    }
}

export default MultidimensionalArray;
