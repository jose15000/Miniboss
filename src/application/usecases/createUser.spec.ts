import { CreateUser } from './createUser';
import { UserRepository } from 'src/domain/repositories/userRepo';
import { User } from 'src/domain/entities/user.entity';

describe('CreateUser', () => {
    let createUser: CreateUser;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByPhone: jest.fn(),
            update: jest.fn(),
        };
        createUser = new CreateUser(userRepo);
    });

    it('should create a new user if not exists', async () => {
        const input = { name: 'Test User', phone: '1234567890' };
        userRepo.findByPhone.mockResolvedValue(null);
        userRepo.save.mockResolvedValue(undefined);

        const result = await createUser.execute(input);

        expect(userRepo.findByPhone).toHaveBeenCalledWith(input.phone);
        expect(result).toBeInstanceOf(User);
        if (!result) throw new Error("Result is null");
        expect(result.name).toBe(input.name);
        expect(result.number).toBe(input.phone);
        expect(userRepo.save).toHaveBeenCalledWith(result);
    });

    it('should return existing user if already exists', async () => {
        const input = { name: 'Test User', phone: '1234567890' };
        const existingUser = new User('existing-id', 'Test User', '1234567890');

        userRepo.findByPhone.mockResolvedValue(existingUser);

        const result = await createUser.execute(input);

        expect(userRepo.findByPhone).toHaveBeenCalledWith(input.phone);
        expect(result).toBe(existingUser);
        expect(userRepo.save).not.toHaveBeenCalled();
    });
});
