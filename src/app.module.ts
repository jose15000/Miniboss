import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaileysClient } from './infra/whatsapp/baileysConnection';
import { WhatsappMessagingService } from './infra/whatsapp/services/messaging';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, BaileysClient, WhatsappMessagingService],
  exports: [WhatsappMessagingService]
})
export class AppModule { }
