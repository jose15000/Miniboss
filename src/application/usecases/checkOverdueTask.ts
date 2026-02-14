import { MinibossRepository } from "src/domain/repositories/minibossRepo";
import { TaskRepository } from "src/domain/repositories/taskRepo";

export class CheckOverdueTask {
    constructor(
        private TaskRepo: TaskRepository,
        private BossRepo: MinibossRepository,
    ) { }

    async execute(input: { userId: string, taskId: string }) {
        const tasks = await this.TaskRepo.findByUserId(input.userId);
        const boss = await this.BossRepo.getUserById(input.userId);

        if (!boss) throw new Error("boss not found");

        const task = tasks.find(t => t.id === input.taskId);
        if (!task) throw new Error("task not found");

        if (task.isOverdue(new Date())) {
            boss.onIgnored();
            await this.BossRepo.update(boss);
        }
    }
}