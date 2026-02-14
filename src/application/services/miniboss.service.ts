import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import { BaileysClient } from '../../infra/whatsapp/baileysConnection';
import type { AIService } from './ai.service';
import { PrismaUserRepo } from '../../infra/db/prisma/repositories/prisma-user-repo';
import { PrismaTaskRepo } from '../../infra/db/prisma/repositories/prisma-task-repo';
import { PrismaMinibossRepo } from '../../infra/db/prisma/repositories/prisma-miniboss-repo';
import { User } from '../../domain/entities/user.entity';
import { Miniboss } from '../../domain/entities/miniboss.entity';
import { Task } from '../../domain/entities/Task.entity';

@Injectable()
export class MinibossService implements OnModuleInit {
    constructor(
        private readonly baileys: BaileysClient,
        @Inject('AIService') private readonly aiService: AIService,
        private readonly userRepo: PrismaUserRepo,
        private readonly taskRepo: PrismaTaskRepo,
        private readonly minibossRepo: PrismaMinibossRepo,
    ) { }

    onModuleInit() {
        this.baileys.setOnMessageHandler(this.handleMessage.bind(this));
    }

    async handleMessage(from: string, text: string) {
        try {
            const phone = from.replace('@s.whatsapp.net', '');
            let user = await this.userRepo.findByPhone(phone);

            if (!user) {
                user = new User(crypto.randomUUID(), 'Friend', phone);
                await this.userRepo.save(user); // Assumes save handles creation

                const miniboss = new Miniboss(crypto.randomUUID(), user.id);
                await this.minibossRepo.save(miniboss);
            }

            let miniboss = await this.minibossRepo.getUserById(user.id).catch(() => null);
            if (!miniboss) {
                miniboss = new Miniboss(crypto.randomUUID(), user.id);
                await this.minibossRepo.save(miniboss);
            }

            let intent = this.aiService.detectIntent(text);


        } catch (error) {
            console.error("Error handling message:", error);
            await this.baileys.sendText(from, "Ocorreu um erro ao processar sua mensagem.");
        }
    }
}
