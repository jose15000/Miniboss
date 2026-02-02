import { User } from "src/domain/entities/user.entity";
import { UserRepo } from "src/domain/repositories/userRepo";

export class CreateUser {
    constructor(
        private readonly userRepo: UserRepo,
    ) { }
    async execute(input: { name: string, phone: string }) {
        const existing = this.userRepo.findByPhone(input.phone);

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