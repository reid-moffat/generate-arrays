/**
 *
 */
class MultidimensionalArray {

    private static _deepArray = (baseArray: [], length: number, depth: number): any[] => {
        if (depth === 1) {
            return baseArray;
        }

        return Array.from({ length }, () => this._deepArray(baseArray, length, depth - 1));
    }

    public static empty = (length: number, depth: number): [][] => {
        return this._deepArray([], length, depth);
    }

    public static uniform = (length: number, value: any, depth: number): any[] => {

        const baseArray = Array(length).fill(value);
        const arr = [];

        for (let i = 0; i < depth; ++i) {
            ;
        }

        if (depth === 1) {
            return Array(length).fill(value);
        }
        return Array.from({ length }, () => this.uniform(length, value, depth - 1));
    }


}

const multidimensional = (arr: any[], depth: number = 1): any[] => {
    if (depth === 1) {
        return arr;
    }
    return Array.from({ length: arr.length }, () => multidimensional(arr, depth - 1));
}

export default MultidimensionalArray;
