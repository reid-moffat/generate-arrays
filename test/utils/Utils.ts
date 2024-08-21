import * as Mocha from 'mocha';

/**
 * Gets the path of the current suite
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

export { getPath };
