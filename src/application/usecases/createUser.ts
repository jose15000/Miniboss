import { User } from "src/domain/entities/user.entity";
import { UserRepository } from "src/domain/repositories/userRepo";
import * as crypto from 'crypto';

export class CreateUser {
    constructor(
        private readonly userRepo: UserRepository,
    ) { }
    async execute(input: { name: string, phone: string }) {
        const existing = await this.userRepo.findByPhone(input.phone);

        if (existing) return existing;

        const user = new User(
            crypto.randomUUID(),
            input.name,
            input.phone,
        )

        await this.userRepo.save(user);
        return user;
    }
}