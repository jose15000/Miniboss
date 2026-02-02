import { Miniboss } from "src/domain/entities/miniboss.entity";
import { MinibossRepo } from "src/domain/repositories/minibossRepo";
import { UserRepo } from "src/domain/repositories/userRepo";

export class CreateMiniboss {
    constructor(private readonly MinibossRepo: MinibossRepo,
        private readonly UserRepo: UserRepo
    ) { }

    async execute(input: { userId: string }) {
        const boss = new Miniboss(
            crypto.randomUUID(),
            input.userId,
            "neutral",
            10,
            0
        )
        await this.MinibossRepo.save(boss);

        return boss;
    };



}