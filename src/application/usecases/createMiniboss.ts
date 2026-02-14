import { Miniboss } from "src/domain/entities/miniboss.entity";
import { MinibossRepository } from "src/domain/repositories/minibossRepo";
import { UserRepository } from "src/domain/repositories/userRepo";
import * as crypto from 'crypto';

export class CreateMiniboss {
    constructor(private readonly MinibossRepository: MinibossRepository,
        private readonly UserRepo: UserRepository
    ) { }

    async execute(input: { userId: string }) {
        const boss = new Miniboss(
            crypto.randomUUID(),
            input.userId,
            "neutral",
            10,
            0
        )
        await this.MinibossRepository.save(boss);

        return boss;
    };



}