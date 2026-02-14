import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaileysClient } from './infra/whatsapp/baileysConnection';
import { WhatsappMessagingService } from './infra/whatsapp/services/messaging';
import { PrismaModule } from './infra/db/prisma/prisma.module';
import { MinibossService } from './application/services/miniboss.service';
import { AIInfrastructure } from './infra/ai/AIService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BaileysClient,
    WhatsappMessagingService,
    MinibossService,
    {
      provide: 'AIService',
      useClass: AIInfrastructure
    }
  ],
  exports: [WhatsappMessagingService]
})
export class AppModule { }
