class GenerateArrayError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GenerateArrayError';
        this.message = message;
        this.stack = (new Error()).stack;
    }
}
