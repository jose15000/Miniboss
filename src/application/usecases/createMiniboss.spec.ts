import { CreateMiniboss } from './createMiniboss';
import { MinibossRepository } from 'src/domain/repositories/minibossRepo';
import { UserRepository } from 'src/domain/repositories/userRepo';
import { Miniboss } from 'src/domain/entities/miniboss.entity';

describe('CreateMiniboss', () => {
    let createMiniboss: CreateMiniboss;
    let bossRepo: jest.Mocked<MinibossRepository>;
    let userRepo: jest.Mocked<UserRepository>;

    beforeEach(() => {
        bossRepo = {
            save: jest.fn(),
            getUserById: jest.fn(),
            update: jest.fn(),
        };
        userRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByPhone: jest.fn(),
            update: jest.fn(),
        };
        createMiniboss = new CreateMiniboss(bossRepo, userRepo);
    });

    it('should create a miniboss successfully', async () => {
        const input = { userId: 'user-1' };
        bossRepo.save.mockResolvedValue(undefined);

        const result = await createMiniboss.execute(input);

        expect(result).toBeInstanceOf(Miniboss);
        expect(result.userId).toBe(input.userId);
        expect(result.humor).toBe('neutral');
        expect(result.patience).toBe(10);
        expect(result.timesIgnored).toBe(0);
        expect(bossRepo.save).toHaveBeenCalledWith(result);
    });
});
