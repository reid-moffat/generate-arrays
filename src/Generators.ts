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

export { integer, decimal, string };
