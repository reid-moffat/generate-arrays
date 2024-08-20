import Validation from "./Validation.ts";
import GenerateArrayError from "./GenerateArrayError.js";

type ArrayLength = number | [number, number];

class GenerateArray {

    private static readonly _characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    private static readonly _charactersWithSpecial = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+/\\{}[]|;:\'",.<>?`~';

    /**
     * Create an array from any given value
     *
     * Return values:
     * -null, undefined -> []
     * -Array -> Array (no change)
     * -Function -> [function return value]
     * -Any other value -> [value]
     *
     * @param prototype Value to create an array from
     */
    public static from(prototype: any) {
        if (Array.isArray(prototype)) {
            return prototype;
        }

        if (!prototype) {
            return [];
        }

        if (typeof prototype === "function") {
            return [prototype()];
        }

        return [prototype];
    }

    /**
     * Generate an array of the specified length filled with undefined values
     *
     * Example:
     * GenerateArray.blank(5) -> [undefined, undefined, undefined, undefined, undefined]
     *
     * @param length Size of array: a set length or a range [min, max] (both inclusive, random length will be chosen)
     */
    public static blank(length: ArrayLength) {

        const len = Validation.arrayLength(length, "length");

        return Array(len);
    }

    /**
     * Generate an array of the specified length filled with the specified value
     *
     * Example:
     * GenerateArray.uniform(5, 7) -> [7, 7, 7, 7, 7]
     *
     * @param length Size of array
     * @param value Value to fill array with
     */
    public static uniform(length: number, value: any) {

        const len = Validation.arrayLength(length, "length");

        return Array(length).fill(value);
    }

    /**
     * Generate an array of the specified length filled with values generated by the given function
     *
     * Examples:
     * GenerateArray.custom(() => Math.random(), 5) -> [0.12345, 0.6789, 0.101112, 0.131415, 0.161718] (possible values)
     * GenerateArray.custom(() => Math.floor(Math.random() * 10), 6) -> [7, 2, 5, 9, 1, 3] (possible values)
     *
     * @param generator Function to generate each array value
     * @param length Size of array
     */
    public static custom = (generator: () => any, length: number): any[] => {

        Validation.function(generator, "generator");
        Validation.arrayLength(length, "length");

        return Array.from({ length }, generator);
    }

    /**
     * Generate an array of numbers from the start value up to a max/min value (both inclusive) with the given step value
     *
     * Examples:
     * GenerateArray.counting(0, 5) -> [0, 1, 2, 3, 4, 5]
     * GenerateArray.counting(1, 10, 2) -> [1, 3, 5, 7, 9]
     * GenerateArray.counting(1.2, 37.9, 4.7) -> [1.2, 5.9, 10.6, 15.3, 20, 24.7, 29.4, 34.1]
     * GenerateArray.counting(10, 1, 2, true) -> [10, 8, 6, 4, 2]
     *
     * @param start Number to start at
     * @param end Value to stop at (may not be included in resulting array)
     * @param step Value added at each step (default 1). Always positive - is subtract is 2, this number is just subtracted
     */
    public static counting = (start: number, end: number, step: number = 1): number[] => {

        const result: number[] = [];

        Validation.numberSimple(start, "start");
        Validation.numberSimple(end, "end");
        Validation.numberSimple(step, "step");

        if (step === 0) {
            throw new GenerateArrayError(`Parameter 'step' must be a non-zero number`);
        }
        if (Math.abs(end - start) / step > Validation.maxArrayLength) {
            throw new GenerateArrayError(`Invalid array length: ${end} to ${start} with step ${step} exceeds ${Validation.maxArrayLength} elements`);
        }

        if (step < 0) {
            Validation.number(start, "start", end);

            for (let i = start; i >= end; i += step) {
                result.push(i);
            }
        } else {
            Validation.number(end, "end", start);

            for (let i = start; i <= end; i += step) {
                result.push(i);
            }
        }

        return result;
    }

    /**
     * Generate an array of random integers of the specified length within the given range
     *
     * Examples:
     * GenerateArray.integers(6) -> [23, 59, 2, 91, 45, 21] (possible values)
     * GenerateArray.integers(5, 10, 20) -> [15, 17, 12, 19, 11] (possible values)
     *
     * @param length Size of array (>= 1)
     * @param min Minimum value (inclusive), default 0
     * @param max Maximum value (exclusive), default 100
     */
    public static integers = (length: number, min: number = 0, max: number = 100) => {

        Validation.arrayLength(length, "length");
        Validation.integer(min, "min");
        Validation.integer(max, "max", min);

        const range = max - min;
        return Array.from({ length }, () => Math.floor(Math.random() * range) + min);
    }

    /**
     * Generate an array of random decimals of the specified length within the given range. May sometimes produce
     * integers if the range is significantly large
     *
     * Examples:
     * GenerateArray.decimals(5) -> [0.12345, 0.6789, 0.101112, 0.131415, 0.161718] (possible values)
     * GenerateArray.decimals(6, 0, 10) -> [7.12345, 2.6789, 5.101112, 9.131415, 1.161718, 3.192021] (possible values)
     *
     * @param length Size of array (>= 1)
     * @param min Minimum value (inclusive), default 0
     * @param max Maximum value (exclusive), default 1
     */
    public static decimals = (length: number, min: number = 0, max: number = 1) => {

        Validation.arrayLength(length, "length");
        Validation.number(min, "min");
        Validation.number(max, "max", min);

        const range = max - min;
        return Array.from({ length }, () => Math.random() * range + min);
    }

    /**
     * Generate an array of random strings of the specified length within the given range
     *
     * @param length Size of array (>= 1)
     * @param minLength Minimum length of string (>= 1), default 1
     * @param maxLength Maximum length of string (>= minLength), default 10
     * @param specialChars If true, includes special characters (!@#$%^&*()_+/\{}[]|;:'",.<>?`~) in the generated
     * strings. By default, only letters and numbers are used (a-zA-Z0-9)
     */
    public static strings = (length: number, minLength: number = 1, maxLength: number = 10, specialChars: boolean = false) => {

        Validation.arrayLength(length, "length");
        Validation.integer(minLength, "minLength", 1);
        Validation.integer(maxLength, "maxLength", minLength);
        Validation.boolean(specialChars, "specialChars");

        const range = maxLength - minLength + 1;
        const chars = specialChars ? this._charactersWithSpecial : this._characters;
        const charLength = chars.length;

        return Array.from({ length }, () => {
            const len = Math.floor(Math.random() * range) + minLength;
            return Array.from({ length: len }, () => chars[Math.floor(Math.random() * charLength)]).join("");
        });
    }

    // / / / / / / / / / / / / / / / / / / / / //
    // Multiple generator functions per array  //
    // / / / / / / / / / / / / / / / / / / / / //

    /**
     * Generate an array of the specified length. Each value is obtained from a random generator with equal chances
     *
     * Example:
     * CustomArray.random(5, [() => Math.random(), () => Math.floor(Math.random() * 10)]) -> [0.12345, 7, 0.101112, 1, 3] (possible values)
     *
     * @param length Size of array to be generated (>= 1)
     * @param generators Array of functions that generate a value (value can be anything)
     */
    public static generators = (length: number, generators: (() => any)[]): any[] => {

        Validation.arrayLength(length, "length");

        for (let i = 0; i < generators.length; i++) {
            Validation.function(generators[i], "generators");
        }

        return Array.from({ length }, () => generators[Math.floor(Math.random() * generators.length)]());
    }

    /**
     * Generate array of the specified length with the specified generators. Each generator has a weighted chance of
     * being used for each element in the array
     *
     * Example:
     * CustomArray.randomChance(7, [{ generator: () => Math.random(), chance: 0.3 }, { generator: () => Math.floor(Math.random() * 10), chance: 0.7 }]) -> [4, 0.12345, 7, 0.101112, 7, 1, 8] (possible values)
     *
     * @param length Size of array to be generated (>= 1)
     * @param generators Array of objects in the form { generator: () => any, chance: number }. Chance for all
     * generators combined must add up to 1
     */
    public static weightedGenerators = (length: number, generators: { generator: () => any, chance: number }[]) => {

        Validation.arrayLength(length, "length");

        let totalChance = 0;
        for (let i = 0; i < generators.length; ++i) {
            Validation.function(generators[i].generator, "generator");
            if (generators[i].chance <= 0 || generators[i].chance >= 1) {
                throw new Error(`Chance must be greater than 0 and less than 1: value '${generators[i].chance}' is invalid`);
            }
            totalChance += generators[i].chance;
        }
        if (Math.abs(totalChance - 1) > 1e-6) {
            throw new Error(`Total chance must be 1: value '${totalChance}' is invalid`);
        }

        // For determining which generator to use
        const cumulativeChances = new Array(generators.length);
        generators.sort((a, b) => b.chance - a.chance); // Higher chance first for efficiency
        cumulativeChances[0] = generators[0].chance;
        for (let i = 1; i < generators.length; i++) {
            cumulativeChances[i] = cumulativeChances[i - 1] + generators[i].chance;
        }

        const result: any[] = [];
        for (let i = 0; i < length; i++) {
            const random = Math.random();
            for (let j = 0; j < cumulativeChances.length; j++) {
                if (random <= cumulativeChances[j]) {
                    result[i] = generators[j].generator();
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Generates an array of the specified length with the specified generators. Each generator is called a fixed
     * amount of times
     *
     * @param length Size of array to be generated (>= 1)
     * @param generators Array of objects in the form { generator: () => any, count: number }. Generators must
     * return a value (any value), and the count of all generators combined must equal the length of the array
     * @param random If true (default), the order of the generated values is random. If false, all values from a
     * specific generator are next to each other in a sequence
     */
    public static fixedCountGenerators = (length: number, generators: { generator: () => any, count: number }[], random: boolean = true) => {

        Validation.arrayLength(length, "length");

        let totalCount = 0;
        for (let i = 0; i < generators.length; ++i) {
            Validation.function(generators[i].generator, "generator");
            Validation.integer(generators[i].count, "count", 1);
            totalCount += generators[i].count;
        }
        if (Math.abs(totalCount - length) > 1e-6) {
            throw new Error(`Total count of all generators must equal the length of the array (${length}): count '${totalCount}' is invalid`);
        }

        const result: any[] = [];
        for (let i = 0; i < generators.length; ++i) {
            for (let j = 0; j < generators[i].count; ++j) {
                result.push(generators[i].generator());
            }
        }

        // Shuffle if random
        if (random) {
            for (let i = result.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }
        }

        return result;
    }


    // / / / / / / / / / / / / //
    // Multidimensional arrays //
    // / / / / / / / / / / / / //

    // Helper for generating multidimensional arrays
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
     * Generates an multidimensional array of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where the base array is empty.
     *
     * Examples:
     * GenerateArray.emptyND(1, 2) -> [[]] (Each array has 1 array in it, and there are 2 levels of arrays)
     * GenerateArray.emptyND(2, 2) -> [[], []] (Each array has 2 arrays in it, and there are 2 levels of arrays)
     * GenerateArray.emptyND(1, 3) -> [[[]]] (There is 1 array in each array, and 3 levels of arrays)
     * GenerateArray.emptyND(2, 3) -> [[[], []], [[], []]] (There are 2 arrays in each array, and 3 levels of arrays)
     *
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Dept of 1 is
     * just [] regardless of length, so not allowed to reduce confusion
     */
    public static emptyND = (length: number, depth: number): any[] => {

        Validation.arrayLength(length, "length");
        Validation.integer(depth, "depth", 2);

        return this._deepArray([], length, depth);
    }

    /**
     * Generates a multidimensional array of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where all base arrays are filled with the given value(s).
     *
     * If the value is an array, the base arrays will be filled with the values of the array instead of adding an
     * extra depth of arrays, e.g. 7 -> [7], [1, 2, 3] -> [1, 2, 3] (put the array in an array if you'd like this)
     *
     * Examples:
     * GenerateArray.uniformND(7, 3, 2) -> [[7], [7], [7]]
     * GenerateArray.uniformND([1, 2, 3], 3, 2) -> [[1, 2, 3], [1, 2, 3], [1, 2, 3]]
     *
     * @param value Value of the base array. If not an array, the base array will be an array filled with this value.
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Depth of 1
     * isn't included to reduce confusion, as it would just return the value in an array (or the value if it's an array)
     * e.g. MultidimensionalArray.uniform([1, 2, 3], 3, 1) -> [1, 2, 3]
     */
    public static uniformND = (value: any, length: number, depth: number): any[] => {

        Validation.arrayLength(length, "length");
        Validation.integer(depth, "depth", 2);

        const baseArray = [];
        if (Array.isArray(value)) {
            baseArray.push(...value);
        } else {
            baseArray.push(value);
        }

        return this._deepArray(baseArray, length, depth);
    }

    /**
     * Generates a multidimensional array of the specific length (number of arrays in each array) and depth (how many
     * levels of arrays to generate before stopping) where the base arrays are generated by the given function.
     *
     * Examples:
     * GenerateArray.customND(() => Math.floor(Math.random() * 10), 3, 2) -> [[7], [2], [5]] (possible output)
     *
     * @param generator Function to generate the base array. Note this function is called once for each base array,
     * so to have multiple values, this function should return an array of multiple values (e.g.
     * GenerateArray.custom(() => [1, 2, 3], len, depth))
     * @param length Number of arrays in each array (>= 1), excluding the base array (array at the lowest depth)
     * @param depth Dimension of the returned array (>= 2), i.e. how many layers of arrays there are. Depth of 1 isn't
     * allowed to reduce confusion as it would just put the value of one function call in an array, e.g. () => 7 -> [7]
     * (to get a 1-D array with multiple values, use GenerateArray.custom(() => ..., len) instead)
     */
    public static customND = (generator: () => any[], length: number, depth: number): any[] => {

        Validation.function(generator, "generator", true);
        Validation.arrayLength(length, "length");
        Validation.integer(depth, "depth", 2);

        return this._deepArray(generator, length, depth);
    }
}

export default GenerateArray;
