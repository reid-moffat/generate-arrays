import { expect } from "chai";
import { generateArray } from "../src/simple.ts";

suite('Simple test 3', () => {
        test('should pass',
            () => { expect(1).to.eq(1) }
        );
    }
);

suite('generateArray', () => {
    test('should return an array of random numbers',
        () => {
            const size = 10;
            const arr = generateArray(size);
            expect(arr).to.have.lengthOf(size);
            arr.forEach(num => {
                expect(num).to.be.a('number');
                expect(num).to.be.within(0, 100);
            });
        }
    );
});
