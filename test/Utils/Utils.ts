/**
 * Gets the path of the current suite
 */
const getPath = function(suite: any) {
    const suites = [];
    let currentSuite = suite;

    while (currentSuite && currentSuite.title) {
        suites.unshift(currentSuite.title);
        currentSuite = currentSuite.parent;
    }

    return suites;
};

export { getPath };
