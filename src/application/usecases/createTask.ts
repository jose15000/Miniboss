import { Task } from "src/domain/entities/Task.entity";
import { TaskRepo } from "src/domain/repositories/taskRepo";
import { AIService } from "../services/ai.service";

export class CreateTask {
    constructor(
        private readonly TaskRepo: TaskRepo,
        private readonly AIService: AIService
    ) { }

    async execute(input: { userId: string, name: string, description?: string, userStimateMinutes: string }) {
        const existingTask = this.TaskRepo.findByUserId(input.userId)
        const now = new Date();
        if (existingTask) return existingTask;

        const adjustedMinutes = await this.AIService.adjustEstimate(input.description!, input.userStimateMinutes);

        const task = new Task(
            crypto.randomUUID(),
            input.userId,
            input.name,
            "pending",
            input.description!,
            0,
            now,
            new Date(now.getTime() + adjustedMinutes * 60_000)
        );
        const save = await this.TaskRepo.create(task);

        return task


    }
}