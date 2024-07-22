/**
 * Generate an array of random numbers from [0, 100)
 * @param size size of the array
 */
const generateArray = (size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

export { generateArray };
