import { BossHumor } from "types/bossHumor"

export interface AIService {
    adjustEstimate(
        taskDescription: string,
        userEstimatedMinutes: string,
    ): Promise<number>

    genereateMessage(
        humor: BossHumor,
        taskName: string,
        minutesLate: number,
    ): Promise<string>
}