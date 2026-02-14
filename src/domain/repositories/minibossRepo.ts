import { Miniboss } from "../entities/miniboss.entity";

export interface MinibossRepository {
    save(miniboss: Miniboss): Promise<void>,
    getUserById(userId: string): Promise<Miniboss>,
    update(miniboss: Miniboss): Promise<void>,
}