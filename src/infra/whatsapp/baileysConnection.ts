import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason
} from "baileys";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class BaileysClient implements OnModuleInit {
    private socket: any;

    async onModuleInit() {
        console.log("🔌 Iniciando conexão com WhatsApp...");
        await this.connect();
    }

    async connect() {
        const { state, saveCreds } =
            await useMultiFileAuthState("auth");

        this.socket = makeWASocket({
            auth: state
        });

        this.socket.ev.on("creds.update", saveCreds);

        this.socket.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                console.log("\n📱 Escaneie o QR Code abaixo com seu WhatsApp:\n");
                require("qrcode-terminal").generate(qr, { small: true });
            }

            if (connection === "open") {
                console.log("✅ WhatsApp conectado com sucesso!");
            }

            if (
                connection === "close" &&
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            ) {
                console.log("🔄 Reconectando...");
                this.connect();
            }
        });
    }

    async sendText(jid: string, text: string) {
        if (!this.socket) {
            throw new Error("Baileys not connected");
        }

        await this.socket.sendMessage(jid, { text });
    }
}
