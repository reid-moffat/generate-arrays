/**
 * Gets the path of the current suite
 */
const getPath = function(suite: any) {

    if (suite === undefined) {
        throw new Error("Suite is undefined in getPath - make sure the suite this is being called from is using the" +
            " function() {} notation, not () => {}");
    }

    const suites = [];
    let currentSuite = suite;

    while (currentSuite && currentSuite.title) {
        suites.unshift(currentSuite.title);
        currentSuite = currentSuite.parent;
    }

    return suites;
};

export { getPath };
