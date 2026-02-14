import { TaskRepository } from "src/domain/repositories/taskRepo";

export class CompleteTask {
    constructor(
        private TaskRepo: TaskRepository
    ) { }

    async execute(input: { userId: string, taskId: string }) {
        const task = await this.TaskRepo.findByUserId(input.userId);

        const getTask = task.find(t => t.id === input.taskId)

        if (!getTask) {
            throw new Error("Task not found");
        }

        getTask.markAsDone()

        const save = await this.TaskRepo.update(getTask);

        return save;
    }
}