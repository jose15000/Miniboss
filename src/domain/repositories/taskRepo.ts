import { Task } from "../entities/Task.entity";

export interface TaskRepository {
    create(task: Task): Promise<void>,
    getTaskById(taskId: string): Promise<Task>,
    update(task: Task): Promise<void>
    findByUserId(userId: string): Promise<Task[]>,
    findOverdue(now: Date): Promise<Task[]>
}