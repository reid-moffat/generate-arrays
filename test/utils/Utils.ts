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
 * Prints an array in a clear format up to the first 100 elements to not clog the console
 */
const printArray = (arr: any[]) => {
    if (arr.length < 100) {
        return JSON.stringify(arr);
    }

    return "[" + arr.slice(0, 100).join(", ") + `, ... (${arr.length - 100} more elements)]`;
}

export { getPath, printArray };
