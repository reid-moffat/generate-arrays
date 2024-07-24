class GenerateArray {
    public static emptyArray(length: number) {
        return Array(length)
    }

    public static uniformArray(length: number, value: any) {
        return Array(length).fill(value);
    }

    public static randomArray(size: number) {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    }
}

export default GenerateArray;
