import { MinibossRepo } from "src/domain/repositories/minibossRepo";
import { TaskRepo } from "src/domain/repositories/taskRepo";

export class CheckOverdueTask {
    constructor(
        private TaskRepo: TaskRepo,
        private BossRepo: MinibossRepo,
    ) { }

    async execute(input: { userId: string, taskId: string }) {
        const task = await this.TaskRepo.findByUserId(input.userId);
        const boss = await this.BossRepo.getUserById(input.userId);

        if (!task) throw new Error("tasks not found");
        if (!boss) throw new Error("boss not found");



        const getTask = task.forEach(task => {
            const losePatience = boss.onIgnored()
        });
    }
}