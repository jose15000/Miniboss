import { BossHumor } from "types/bossHumor";

export class Miniboss {
    constructor(
        public readonly id: string,
        public userId: string,
        public humor: BossHumor = "neutral",
        public patience: number = 10,
        public timesIgnored: number = 0,
    ) { }

    onIgnored() {
        this.timesIgnored++;
        this.patience--;

        this.updateHumor();
    }

    private updateHumor() {
        if (this.timesIgnored > 6) {
            this.humor = "angry";
            return;
        }

        if (this.timesIgnored > 3) {
            this.humor = "passive-aggressive";
            return;
        }

        this.humor = "neutral";
    }

    getHumor() {
        return this.humor;
    }

    isOutOfPatience(): boolean {
        return this.patience <= 0;
    }

}