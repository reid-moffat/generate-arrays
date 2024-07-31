class ArrayUtils {
    static removeDuplicates(array) {
        return array.filter((value, index, self) => self.indexOf(value) === index);
    }
}

export default ArrayUtils;
