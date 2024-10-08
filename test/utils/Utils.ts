import * as Mocha from 'mocha';

/**
 * Logs a message if the DETAILED_LOGS environment variable is set
 * This should be used when logging information necessary for running tests in the IDE, but not in github actions
 */
const log = (text: string) => {
    if (process.env.SUPRESS_PASSING_OUTPUT) return;
    console.log(text);
}

/**
 * Gets the path of the current suite for TestMetrics
 */
const getPath = function(suite: Mocha.Suite | Mocha.Context): string[] {

    if (suite === undefined) {
        throw new Error("Suite is undefined in getPath - make sure the suite this is being called from is using the" +
            " function() {} notation, not () => {}");
    }

    const suites = [];
    let current: Mocha.Suite | Mocha.Runnable | undefined = suite instanceof Mocha.Context ? suite.test : suite;

    while (current && current.title) {
        suites.unshift(current.title);
        current = current.parent;
    }

    return suites;
};

/**
 * Like JSON.stringify, but works with BigInt and Symbols
 */
const stringify = (value: any): string => {
    if (typeof value === 'bigint') {
        return value + " (BigInt)"
    }
    if (!Array.isArray(value) && (typeof value === "object" || typeof value === "string")) {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return "[" + value.map(v => stringify(v)).join(", ") + "]";
    }

    return String(value);
}

/**
 * Formats tes output, truncating output that is very long to not clog up the console
 */
const printOutput = (obj: any): string => {
    if (Array.isArray(obj) && obj.length > 100) {
        return "[" + obj.slice(0, 100).map(o => printOutput(o)).join(", ") + `, ... (${obj.length - 100} more elements)]`;
    }

    if (typeof obj === 'string' && obj.length > 100) {
        return obj.slice(0, 100) + ` ... (truncated, ${obj.length - 100} more characters)`;
    }

    return stringify(obj);
}

/**
 * Formats a number with commas to make it easy-to-read
 */
const formatNumber = (num: number) => {
    const parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

/**
 * Returns a random number between min and max, with a bias towards the lower end
 */
const biasRandom = (max: number, min: number = 1, factor: number = 5) => {
    return Math.floor(Math.pow(Math.random(), factor) * (max - min)) + min;
}

export { log, getPath, stringify, printOutput, formatNumber, biasRandom };
