import { TaskRepo } from "src/domain/repositories/taskRepo";

export class CompleteTask {
    constructor(
        private TaskRepo: TaskRepo
    ) { }

    async execute(input: { userId: string, taskId: string }) {
        const task = await this.TaskRepo.findByUserId(input.userId);

        const getTask = task.find(t => t.id === input.taskId)

        const finish = getTask?.markAsDone()

        const save = this.TaskRepo.update(finish!);

        return save;
    }
}