import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    WASocket,
    proto
} from "baileys";
import { Boom } from "boom";
import { Injectable, OnModuleInit } from "@nestjs/common";
import qrcode from "qrcode-terminal";

@Injectable()
export class BaileysClient implements OnModuleInit {
    private socket: WASocket | null = null;

    private onMessageHandler?: (
        from: string,
        text: string,
        rawMessage: proto.IWebMessageInfo
    ) => Promise<void>;

    async onModuleInit() {
        console.log("🔌 Iniciando conexão com WhatsApp...");
        await this.connect();
    }

    /**
     * Permite que outra camada registre um handler
     * para mensagens recebidas
     */
    setOnMessageHandler(
        handler: (
            from: string,
            text: string,
            rawMessage: proto.IWebMessageInfo
        ) => Promise<void>
    ) {
        this.onMessageHandler = handler;
    }

    /**
     * Conecta ao WhatsApp
     */
    private async connect() {
        const { state, saveCreds } = await useMultiFileAuthState("auth");

        this.socket = makeWASocket({
            auth: state,
            printQRInTerminal: false
        });

        /**
         * Atualização de credenciais
         */
        this.socket.ev.on("creds.update", saveCreds);

        /**
         * Status da conexão
         */
        this.socket.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                console.log("\n📱 Escaneie o QR Code abaixo:\n");
                qrcode.generate(qr, { small: true });
            }

            if (connection === "open") {
                console.log("✅ WhatsApp conectado com sucesso!");
            }

            if (
                connection === "close" &&
                (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            ) {
                console.log("🔄 Conexão perdida. Reconectando...");
                this.connect();
            }

            if (
                connection === "close" &&
                (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut
            ) {
                console.log("❌ WhatsApp deslogado. Apague a pasta auth e escaneie novamente.");
            }
        });

        /**
         * Recebimento de mensagens
         */
        this.socket.ev.on("messages.upsert", async ({ messages, type }) => {
            if (type !== "notify") return;

            const message = messages[0];
            if (!message) return;
            if (message.key.fromMe) return;

            const text =
                message.message?.conversation ||
                message.message?.extendedTextMessage?.text;

            if (!text) return;

            const from = message.key.remoteJid;
            if (!from) return;

            console.log("📩 Mensagem recebida:", from, text);

            if (this.onMessageHandler) {
                await this.onMessageHandler(from, text, message);
            }
        });
    }

    /**
     * Envia mensagem de texto
     */
    async sendText(jid: string, text: string) {
        if (!this.socket) {
            throw new Error("BaileysClient: socket não conectado");
        }

        await this.socket.sendMessage(jid, { text });
    }

    /**
     * Fecha a conexão manualmente (opcional)
     */
    async disconnect() {
        if (this.socket) {
            await this.socket.logout();
            this.socket = null;
        }
    }
}
