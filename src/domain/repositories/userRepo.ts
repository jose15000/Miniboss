import { User } from "../entities/user.entity";

export interface UserRepo {
    save(user: User): Promise<void>,
    findById(userId: string): Promise<User | null>,
    findByPhone(phone: string): Promise<string>,
    update(user: User): Promise<void>,
}