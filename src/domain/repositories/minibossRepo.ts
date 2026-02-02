import { Miniboss } from "../entities/miniboss.entity";

export interface MinibossRepo {
    save(miniboss: Miniboss): Promise<void>,
    getUserById(userId: string): Promise<Miniboss>,
    update(miniboss: Miniboss): Promise<void>,
}