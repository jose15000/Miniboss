import { MinibossRepository } from "src/domain/repositories/minibossRepo";
import { TaskRepository } from "src/domain/repositories/taskRepo";
import { UserRepository } from "src/domain/repositories/userRepo";

export class UserIgnoreTask {
    constructor(
        private userRepo: UserRepository,
        private taskRepo: TaskRepository,
        private bossRepo: MinibossRepository
    ) { }

    async execute(input: { taskId: string, userId: string }) {
        const user = await this.userRepo.findById(input.userId)
        const task = await this.taskRepo.getTaskById(input.taskId)
        const boss = await this.bossRepo.getUserById(input.userId)
        if (!user) throw new Error("user not found.");
        if (!task) throw new Error("task not found.")
        if (!boss) throw new Error("task not found.")
        user.ignore();
        task.ignored();
        boss.onIgnored();

        await this.userRepo.update(user);
        await this.taskRepo.update(task);
        await this.bossRepo.update(boss);

    }
}