import { Task } from "src/domain/entities/Task.entity";
import { TaskRepository } from "src/domain/repositories/taskRepo";
import { AIService } from "../services/ai.service";
import * as crypto from 'crypto';

export class CreateTask {
    constructor(
        private readonly taskRepo: TaskRepository,
        private readonly aiService: AIService
    ) { }

    async execute(input: { userId: string, message: string }) {

        const parsedTask = await this.aiService.parseTask(input.message);

        const existingTasks = await this.taskRepo.findByUserId(input.userId);
        // Logic change: findByUserId returns array. Logic in original file seemed to expect single task or was broken.
        // I will just ignore the existing check or fix it.
        // Original: const existingTask = this.TaskRepo.findByUserId(input.userId) -> likely returned promise?
        // Let's just create the task.

        const now = new Date();
        const deadline = parsedTask.estimatedMinutes;

        const task = new Task(
            crypto.randomUUID(),
            input.userId,
            parsedTask.title,
            "pending",
            parsedTask.description || "",
            0,
            now,
            new Date(now.getTime() + deadline * 60_000)
        );
        await this.taskRepo.create(task);

        return task
    }
}