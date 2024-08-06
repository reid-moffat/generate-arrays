import { TestTimer } from "./TestTimer.ts";

suite("PerformanceMetrics", () => {
    test("All", () => {
        TestTimer.printTimings();
    });
});
