import GenerateArrayError from "./GenerateArrayError.ts";
import Validation from "./Validation.ts";

/**
 * Generator for a random integer. By default, the number is between 0 and 100 (both inclusive)
 *
 * @param min Minimum value
 * @param max Maximum value
 */
const integer = (min: number = 0, max: number = 100) => {
    return () => Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generator for a random decimal number. By default, the number is between 0 and 100 with a precision of 5
 *
 * @param min Minimum value
 * @param max Maximum value
 * @param precision Number of decimal places
 */
const decimal = (min: number = 0, max: number = 100, precision: number = 5) => {
    return () => (Math.random() * (max - min) + min).toFixed(precision);
}

/**
 * Generator for a random string. By default, the string is a length of 10 and uses alphanumeric characters
 *
 * @param length Length of the string as a set number or a range [min, max] (both inclusive)
 * @param specialChars True to include special characters
 */
const string = (length: number | [number, number] = 10, specialChars: boolean = false) => {

    // ASCII min/max
    const min = specialChars ? 33 : 48;
    const max = specialChars ? 126 : 122;

    // Variable length
    if (Array.isArray(length)) {
        if (length.length !== 2) {
            throw new GenerateArrayError('Length range must be an array of two numbers: [min, max]');
        }
        Validation.integer(length[0], 0, 'Length min');
        Validation.integer(length[1], min, 'Length max');

        return () => { // @ts-ignore
            length = Math.floor(Math.random() * (length[1] - length[0] + 1) + length[0]);
            return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min)).join('');
        }
    }

    // @ts-ignore
    return () => Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min)).join('');
}

/**
 * Generator for a random boolean value
 *
 * @param trueChance Chance for the value to be true (between 0 and 1)
 */
const boolean = (trueChance: number = 0.5) => {
    if (trueChance < 0 || trueChance > 1) {
        throw new GenerateArrayError('Chance for true value must be between 0 and 1');
    }

    return () => Math.random() < trueChance;
}

/**
 * Generator for a random UUID
 */
const uuid = () => {
    return () => "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

export { integer, decimal, string, boolean, uuid };
