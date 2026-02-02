export interface MessagingService {
    send(phone: string, message: string): Promise<void>
}