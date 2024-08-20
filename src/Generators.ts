import GenerateArrayError from "./GenerateArrayError.ts";
import Validation from "./Validation.ts";

/**
 * Generator for a random integer. By default, the number is between 0 and 100 (both inclusive)
 *
 * @param min Minimum value
 * @param max Maximum value
 */
const integer = (min: number = 0, max: number = 100) => {

    Validation.integer(min, 'Min');
    Validation.integer(max, 'Max', min);

    return () => Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generator for a random decimal number. By default, the number is between 0 and 100 with a precision of 5
 *
 * @param min Minimum value
 * @param max Maximum value (must be >= min)
 * @param precision Number of decimal places
 */
const decimal = (min: number = 0, max: number = 100, precision: number = 5) => {

    Validation.number(min, 'Min');
    Validation.number(max, 'Max', min);
    Validation.integer(precision, 'precision', 0);

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
    Validation.boolean(specialChars, 'specialChars');
    const min = specialChars ? 33 : 48;
    const max = specialChars ? 126 : 122;

    // Variable length
    if (Array.isArray(length)) {
        if (length.length !== 2) {
            throw new GenerateArrayError('Length range must be an array of two numbers: [min, max]');
        }
        Validation.integer(length[0], 'Length min (length[0])', 0);
        Validation.integer(length[1], 'Length max (length[1])', length[0]);

        return () => { // @ts-ignore
            length = Math.floor(Math.random() * (length[1] - length[0] + 1) + length[0]);
            return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min)).join('');
        }
    }

    Validation.arrayLength(length, 'length');

    // @ts-ignore
    return () => Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (max - min + 1)) + min)).join('');
}

/**
 * Generator for a random boolean value
 *
 * @param trueChance Chance for the value to be true (between 0 and 1), default is 0.5
 */
const boolean = (trueChance: number = 0.5) => {

    Validation.number(trueChance, 'trueChance', 0, 1);

    return () => Math.random() < trueChance;
}

/**
 * Generator for a random date. By default, the date is between 1970-01-01 and the current date
 *
 * @param min Lower bound for the date
 * @param max Upper bound for the date
 */
const date = (min: Date = new Date(0), max: Date = new Date()) => {

    if (!(min instanceof Date) || !(max instanceof Date)) {
        throw new GenerateArrayError('Date parameters must be of type Date');
    }

    return () => new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()));
}

/**
 * Generator for a random phone number
 *
 * @param countryCode Set to true to generate a random country code each time
 * @param format Whether to format the phone number, e.g. +1 (123)-456-7890. If false (default), string is just numbers
 */
const phone = (countryCode: boolean = false, format: boolean = false) => {

    Validation.boolean(countryCode, 'countryCode');
    Validation.boolean(format, 'format');

    return () => {
        const countryCodeStr = countryCode ? "+" + integer(1, 999)() : '';
        const areaCode = integer(100, 999)();
        const exchange = integer(100, 999)();
        const subscriber = integer(1000, 9999)();

        if (!format) {
            return `${countryCodeStr}${areaCode}${exchange}${subscriber}`;
        }
        return `${countryCodeStr} (${areaCode})-${exchange}-${subscriber}`;
    }
}

/**
 * Generator for a random UUID
 */
const uuid = () => {
    return () => "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
}

/**
 * Generator for a random IP address (IPv6 by default)
 *
 * @param IPv4 Set to true to generate an IPv4 address
 */
const ipAddress = (IPv4 = false) => {

    Validation.boolean(IPv4, 'IPv4');

    if (IPv4) {
        return () => `${integer(0, 255)()}.${integer(0, 255)()}.${integer(0, 255)()}.${integer(0, 255)()}`;
    }

    return () => {
        let address = [];
        for (let i = 0; i < 8; i++) {
            address.push(integer(0, 65535)().toString(16).padStart(4, '0'));
        }
        return address.join(':');
    };
}

/**
 * Generator for a random email address
 */
const email = () => {
    return () => {
        const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com'];
        return `${string([5, 15])()}@${domains[integer(0, domains.length - 1)()]}`;
    }
}

/**
 * Generator for a random URL
 */
const url = () => {
    return () => {
        const domains = ['com', 'org', 'net', 'gov', 'edu', 'io', 'co', 'uk', 'ca', 'us', 'biz', 'info'];
        return `https://www.${string([5, 15])()}.${domains[integer(0, domains.length - 1)()]}`;
    }
}

/**
 * Generator for a random name
 */
const name = () => {
    return () => {
        const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Megan', 'William', 'Olivia', 'James', 'Sophia', 'Joseph', 'Isabella', 'Daniel', 'Grace', 'Matthew'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson'];
        return `${firstNames[integer(0, firstNames.length - 1)()]} ${lastNames[integer(0, lastNames.length - 1)()]}`;
    }
}

export { integer, decimal, string, boolean, date, phone, uuid, ipAddress, email, url, name };
