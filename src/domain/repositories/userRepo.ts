import { User } from "../entities/user.entity";

export interface UserRepository {
    save(user: User): Promise<void>,
    findById(userId: string): Promise<User | null>,
    findByPhone(phone: string): Promise<User | null>,
    update(user: User): Promise<void>,
}