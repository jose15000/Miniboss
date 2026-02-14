import { BossHumor } from "./bossHumor"

export type GenerateThreatMessage = {
    bossHumor: BossHumor,
    taskTitle: string,
    minutesLate: number,
    timesIgnored: number
}