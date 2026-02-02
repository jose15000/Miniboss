import { MinibossRepo } from "src/domain/repositories/minibossRepo";
import { TaskRepo } from "src/domain/repositories/taskRepo";
import { UserRepo } from "src/domain/repositories/userRepo";
import { AIService } from "../services/ai.service";
import { MessagingService } from "../services/messaging.service";

export class NotifyUser {
    constructor(
        private BossRepo: MinibossRepo,
        private TaskRepo: TaskRepo,
        private UserRepo: UserRepo,
        private AIService: AIService,
        private MessagingService: MessagingService
    ) { }

    async execute(input: { taskId: string, userId: string }) {
        const user = await this.UserRepo.findById(input.userId);
        const task = await this.TaskRepo.getTaskById(input.taskId);
        const boss = await this.BossRepo.getUserById(input.userId);

        const humor = boss.getHumor();
        const taskName = task.name

        const now = new Date()

        const minutesLate = task.isOverdue(now)
            ? Math.floor((now.getTime() - task.deadline.getTime()) / 60000)
            : 0;

        const message = await this.AIService.genereateMessage(humor, taskName, minutesLate)

        await this.MessagingService.send(user?.number!, message)
    }
}