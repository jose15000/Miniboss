import { MessagingService } from "src/application/services/messaging.service";
import { BaileysClient } from "../baileysConnection";

export class WhatsappMessagingService implements MessagingService {
    constructor(private client: BaileysClient) { }

    async send(phone: string, message: string): Promise<void> {
        const jid = `${phone}@s.whatsapp.net`;

        await this.client.sendText(jid, message)
    }
}