import { TaskStatus } from "types/taskType";

export class Task {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public name: string,
        public status: TaskStatus = "pending",
        public description: string,
        public timesIgnored: number = 0,
        public createdAt: Date,
        public deadline: Date,
    ) { }

    markAsDone(): void {
        if (this.status === "done") {
            throw new Error("Task already completed");
        }

        this.status = "done";
    }

    ignored(): void {
        this.timesIgnored++;
    }

    isOverdue(now: Date): boolean {
        return now > this.deadline && this.status !== "done";
    }

    getStatus(): TaskStatus {
        return this.status;
    }

    getTimesIgnored(): number {
        return this.timesIgnored;
    }
} 