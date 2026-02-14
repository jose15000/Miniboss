import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUserRepo } from './repositories/prisma-user-repo';
import { PrismaTaskRepo } from './repositories/prisma-task-repo';
import { PrismaMinibossRepo } from './repositories/prisma-miniboss-repo';

@Module({
    providers: [
        PrismaService,
        PrismaUserRepo,
        PrismaTaskRepo,
        PrismaMinibossRepo,
    ],
    exports: [
        PrismaUserRepo,
        PrismaTaskRepo,
        PrismaMinibossRepo,
    ],
})
export class PrismaModule { }
