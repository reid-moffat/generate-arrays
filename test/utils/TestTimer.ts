class TestTimer {
    private startTimes: Map<string, number> = new Map();
    private executionTimes: Map<string, number[]> = new Map();
    private errorCounts: Map<string, number> = new Map();

    /**
     * Start timing for a specific test or suite.
     * @param {string} key - Unique identifier for the test or suite.
     */
    startTiming(key: string): void {
        this.startTimes.set(key, Date.now());
    }

    /**
     * Stop timing for a specific test or suite and record the execution time.
     * @param {string} key - Unique identifier for the test or suite.
     */
    stopTiming(key: string): void {
        const startTime = this.startTimes.get(key);
        if (startTime !== undefined) {
            const elapsed = Date.now() - startTime;
            this.executionTimes.set(key, [...(this.executionTimes.get(key) || []), elapsed]);
            this.startTimes.delete(key);
        }
    }

    /**
     * Get the total execution time for a specific test or suite.
     * @param {string} key - Unique identifier for the test or suite.
     * @returns {number} - Total execution time in milliseconds.
     */
    getTotalTime(key: string): number {
        const times = this.executionTimes.get(key);
        return times ? times.reduce((acc, time) => acc + time, 0) : 0;
    }

    /**
     * Get the average execution time for a specific test or suite.
     * @param {string} key - Unique identifier for the test or suite.
     * @returns {number} - Average execution time in milliseconds.
     */
    getAverageTime(key: string): number {
        const times = this.executionTimes.get(key);
        return times ? this.getTotalTime(key) / times.length : 0;
    }

    /**
     * Record an error occurrence for a specific test or suite.
     * @param {string} key - Unique identifier for the test or suite.
     */
    recordError(key: string): void {
        this.errorCounts.set(key, (this.errorCounts.get(key) || 0) + 1);
    }

    /**
     * Get the number of errors for a specific test or suite.
     * @param {string} key - Unique identifier for the test or suite.
     * @returns {number} - Number of errors.
     */
    getErrorCount(key: string): number {
        return this.errorCounts.get(key) || 0;
    }

    /**
     * Clear all recorded timings and errors.
     */
    clear(): void {
        this.startTimes.clear();
        this.executionTimes.clear();
        this.errorCounts.clear();
    }
}
