import * as Mocha from 'mocha';

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
 * Formats tes output, truncating output that is very long to not clog up the console
 */
const printOutput = (obj: any) => {
    if (Array.isArray(obj) && obj.length > 100) {
        return "[" + obj.slice(0, 100).join(", ") + `, ... (${obj.length - 100} more elements)]`;
    }

    if (typeof obj === 'string' && obj.length > 100) {
        return obj.slice(0, 100) + ` ... (truncated, ${obj.length - 100} more characters)`;
    }

    return JSON.stringify(obj);
}

/**
 * Formats a number with commas to make it easy-to-read
 */
const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { getPath, printOutput, formatNumber };
