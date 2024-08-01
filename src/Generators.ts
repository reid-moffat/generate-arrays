const integer = (min: number = 0, max: number = 100) => {
    return () => Math.floor(Math.random() * (max - min + 1) + min);
}

const decimal = (min: number = 0, max: number = 100, precision: number = 5) => {
    return () => (Math.random() * (max - min) + min).toFixed(precision);
}

const string = (length: number = 10) => {
    return () => Math.random().toString(36).substring(2, 2 + length);
}

export { integer, decimal, string };
