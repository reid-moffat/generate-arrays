import Validation from "./Validation.ts";

class CustomArray {



    /**
     * Generate array of the specified length with the specified generators. Each generator has a weighted chance of
     * being used for each element in the array
     *
     * Example:
     * CustomArray.randomChance(6, [{ generator: () => Math.random(), chance: 0.3 }, { generator: () => Math.floor(Math.random() * 10), chance: 0.7 }]) -> [4, 0.12345, 7, 0.101112, 7, 1] (possible values)
     *
     * @param length Size of array to be generated (>= 1)
     * @param generators Array of objects in the form { generator: () => any, chance: number }. Chance for all
     * generators combined must add up to 1
     */
    public static weightedGenerators = (length: number, generators: { generator: () => any, chance: number }[]) => {

        Validation.integer(length, 1, "length");

        let totalChance = 0;
        for (let i = 0; i < generators.length; ++i) {
            Validation.function(generators[i].generator, "generator");
            if (generators[i].chance <= 0 || generators[i].chance >= 1) {
                throw new Error(`Chance must be greater than 0 and less than 1: value '${generators[i].chance}' is invalid`);
            }
            totalChance += generators[i].chance;
        }
        if (Math.abs(totalChance - 1) > 1e-6) {
            throw new Error(`Total chance must be 1: value '${totalChance}' is invalid`);
        }

        // For determining which generator to use
        const cumulativeChances = new Array(generators.length);
        generators.sort((a, b) => b.chance - a.chance); // Higher chance first for efficiency
        cumulativeChances[0] = generators[0].chance;
        for (let i = 1; i < generators.length; i++) {
            cumulativeChances[i] = cumulativeChances[i - 1] + generators[i].chance;
        }

        const result: any[] = [];
        for (let i = 0; i < length; i++) {
            const random = Math.random();
            for (let j = 0; j < cumulativeChances.length; j++) {
                if (random <= cumulativeChances[j]) {
                    result[i] = generators[j].generator();
                    break;
                }
            }
        }

        return result;
    }
}

export default CustomArray;
