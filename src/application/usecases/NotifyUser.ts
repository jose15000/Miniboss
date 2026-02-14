import { MinibossRepository } from "src/domain/repositories/minibossRepo";
import { TaskRepository } from "src/domain/repositories/taskRepo";
import { UserRepository } from "src/domain/repositories/userRepo";
import { AIService } from "../services/ai.service";
import { MessagingService } from "../services/messaging.service";

export class NotifyUser {
    constructor(
        private BossRepo: MinibossRepository,
        private TaskRepo: TaskRepository,
        private UserRepo: UserRepository,
        private AIService: AIService,
        private MessagingService: MessagingService
    ) { }

    async execute(input: { taskId: string, userId: string }) {
        const user = await this.UserRepo.findById(input.userId);
        const task = await this.TaskRepo.getTaskById(input.taskId);
        const boss = await this.BossRepo.getUserById(input.userId);
        if (!user) throw new Error("User not found");
        if (!task) throw new Error("Task not found");
        if (!boss) throw new Error("Boss not found");
        const humor = boss.getHumor();
        const taskName = task.name

        const now = new Date()

        const minutesLate = task.isOverdue(now)
            ? Math.floor((now.getTime() - task.deadline.getTime()) / 60000)
            : 0;

        const message = await this.AIService.generateThreatMessage({
            bossHumor: humor,
            taskTitle: taskName,
            minutesLate,
            timesIgnored: boss.timesIgnored
        })

        await this.MessagingService.send(user?.number!, message)
    }
}