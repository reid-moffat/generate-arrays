import Validation from "../utils/Validation.ts";

class ArrayUtils {

    /**
     * Adds the specified number of dimensions to the array (i.e. wraps the array in arrays the specified number of times)
     *
     * Example:
     * addDimensions(arr, 1) -> [arr]
     * addDimensions(arr, 2) -> [[arr]]
     * addDimensions(arr, 4) -> [[[[arr]]]]
     *
     * @param arr Array to add dimensions to
     * @param depth Number of dimensions to add (>= 1)
     */
    public static addDimensions<T>(arr: T[], depth: number): T[] {

        Validation.array(arr, "arr");
        Validation.integer(depth, "depth", 1);

        let newArr: any[] = arr.slice();
        for (let i = 0; i < depth; ++i) {
            newArr = [newArr];
        }

        return newArr;
    }

    /**
     * Flattens the array to a single dimension. This removes all nested arrays, placing all non-array elemnts in a single array
     *
     * Example:
     * flatten([1, [2, 3], [4, [5, 6]]]) -> [1, 2, 3, 4, 5, 6]
     *
     * @param arr
     */
    public static flatten(arr: any[]): any[] {

        Validation.array(arr, "arr");

        return arr.flat(Infinity);
    }

    /**
     * Multiplies the array within itself n times (i.e. repeats the elements in the array n times). Does not modify the original array
     *
     * Example:
     * multiplyLength([1, 2], 3) -> [1, 2, 1, 2, 1, 2]
     * multiplyLength([1, 2], 3, true) -> [1, 1, 1, 2, 2, 2]
     *
     * @param arr Array to multiply
     * @param factor Number of times to multiply the array (>= 2)
     * @param elementWise If false (default), repeats the entire array before repeating the next array. If true,
     * repeats each element n times before repeating the next element in the array
     */
    public static multiplyLength(arr: any[], factor: number, elementWise = false): any[] {

        Validation.array(arr, "arr");
        Validation.integer(factor, "factor", 2);
        Validation.boolean(elementWise, "elementWise");

        const result: any[] = [];

        if (elementWise) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < factor; j++) {
                    result.push(arr[i]);
                }
            }
            return result;
        }

        for (let i = 0; i < factor; i++) {
            for (let j = 0; j < arr.length; j++) {
                result.push(arr[j]);
            }
        }
        return result;
    }

    /**
     * Returns a copy of the given array with any duplicate values removed
     *
     * @param arr Array to remove duplicates from
     */
    static removeDuplicates(arr: any[]) {

        Validation.array(arr, "arr");

        const seen: { [index: string]: boolean } = {};
        const result: any[] = [];

        for (let i = 0; i < arr.length; i++) {
            if (!seen[arr[i]]) {
                seen[arr[i]] = true;
                result.push(arr[i]);
            }
        }

        return result;
    }
}

export default ArrayUtils;
