import { Injectable } from '@nestjs/common';
import { Miniboss } from 'src/domain/entities/miniboss.entity';
import { MinibossRepository } from 'src/domain/repositories/minibossRepo';
import { PrismaService } from '../prisma.service';
import { BossHumor } from 'types/bossHumor';

@Injectable()
export class PrismaMinibossRepo implements MinibossRepository {
  constructor(private prisma: PrismaService) { }

  async save(miniboss: Miniboss): Promise<void> {
    await this.prisma.miniboss.upsert({
      where: { id: miniboss.id },
      create: {
        id: miniboss.id,
        userId: miniboss.userId,
        humor: miniboss.humor,
        patience: miniboss.patience,
        timesIgnored: miniboss.timesIgnored,
      },
      update: {
        humor: miniboss.humor,
        patience: miniboss.patience,
        timesIgnored: miniboss.timesIgnored,
      },
    });
  }

  async getUserById(userId: string): Promise<Miniboss> {
    const miniboss = await this.prisma.miniboss.findUnique({
      where: { userId },
    });

    if (!miniboss) throw new Error("Miniboss not found");

    return new Miniboss(
      miniboss.id,
      miniboss.userId,
      miniboss.humor as BossHumor,
      miniboss.patience,
      miniboss.timesIgnored,
    );
  }

  async update(miniboss: Miniboss): Promise<void> {
    await this.prisma.miniboss.update({
      where: { id: miniboss.id },
      data: {
        humor: miniboss.humor,
        patience: miniboss.patience,
        timesIgnored: miniboss.timesIgnored,
      },
    });
  }
}
