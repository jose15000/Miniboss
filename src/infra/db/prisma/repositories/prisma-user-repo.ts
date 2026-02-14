import { Injectable } from "@nestjs/common";
import { User } from "src/domain/entities/user.entity";
import { UserRepository } from "src/domain/repositories/userRepo";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserRepo implements UserRepository {
    constructor(private prisma: PrismaService) { }

    async save(user: User): Promise<void> {
        await this.prisma.user.upsert({
            where: { id: user.id },
            create: {
                id: user.id,
                name: user.name,
                number: user.number,
                email: user.email,
                timesIgnoring: user.timesIgnoring,
            },
            update: {
                name: user.name,
                number: user.number,
                email: user.email,
                timesIgnoring: user.timesIgnoring,
            }
        });
    }

    async findByPhone(phone: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { number: phone }
        });

        if (!user) return null;

        return new User(
            user.id,
            user.name,
            user.number,
            user.email ?? undefined,
            user.timesIgnoring
        );
    }

    async findById(userId: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) return null;

        return new User(
            user.id,
            user.name,
            user.number,
            user.email ?? undefined,
            user.timesIgnoring
        );
    }

    async update(user: User): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                name: user.name,
                email: user.email,
                timesIgnoring: user.timesIgnoring
            }
        });
    }
}
