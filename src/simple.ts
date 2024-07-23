const emptyArray = (length: number) => {
    return Array(length)
}

const uniformArray = (length: number, value: any) => {
    return Array(length).fill(value);
}

const randomArray = (size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

/**
 * Generate an array of random numbers from [0, 100)
 * @param size size of the array
 */
const generateArray = (size: number) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

export { emptyArray, uniformArray, randomArray, generateArray };
