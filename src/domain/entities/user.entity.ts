export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly number: string,
        public email?: string,
        public timesIgnoring: number = 0,
    ) { }

    ignore() {
        this.timesIgnoring++;
    }

    getTimesIgnoring() {
        return this.timesIgnoring;
    }
} 