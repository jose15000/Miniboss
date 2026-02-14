import { Injectable } from "@nestjs/common";
import { Task } from "src/domain/entities/Task.entity";
import { TaskRepository } from "src/domain/repositories/taskRepo";
import { PrismaService } from "../prisma.service";
import { TaskStatus } from "types/taskType";

@Injectable()
export class PrismaTaskRepo implements TaskRepository {
    constructor(private prisma: PrismaService) { }

    async create(task: Task): Promise<void> {
        await this.prisma.task.create({
            data: {
                id: task.id,
                userId: task.userId,
                name: task.name,
                description: task.description,
                status: task.status,
                timesIgnored: task.timesIgnored,
                deadline: task.deadline,
                createdAt: task.createdAt
            }
        });
    }

    async getTaskById(taskId: string): Promise<Task> {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) throw new Error("Task not found");

        return new Task(
            task.id,
            task.userId,
            task.name,
            task.status as TaskStatus,
            task.description || "",
            task.timesIgnored,
            task.createdAt,
            task.deadline
        );
    }

    async update(task: Task): Promise<void> {
        await this.prisma.task.update({
            where: { id: task.id },
            data: {
                name: task.name,
                description: task.description,
                status: task.status,
                timesIgnored: task.timesIgnored,
                deadline: task.deadline
            }
        });
    }


    async findByUserId(userId: string): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            where: { userId }
        });

        return tasks.map(task => new Task(
            task.id,
            task.userId,
            task.name,
            task.status as TaskStatus,
            task.description || "",
            task.timesIgnored,
            task.createdAt,
            task.deadline
        ));
    }

    async findOverdue(now: Date): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            where: {
                deadline: { lt: now },
                status: { not: "done" }
            }
        });

        return tasks.map(task => new Task(
            task.id,
            task.userId,
            task.name,
            task.status as TaskStatus,
            task.description || "",
            task.timesIgnored,
            task.createdAt,
            task.deadline
        ));
    }
}
