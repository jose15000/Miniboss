import { UserIgnoreTask } from './userIgnoreTask';
import { UserRepository } from 'src/domain/repositories/userRepo';
import { TaskRepository } from 'src/domain/repositories/taskRepo';
import { MinibossRepository } from 'src/domain/repositories/minibossRepo';
import { User } from 'src/domain/entities/user.entity';
import { Task } from 'src/domain/entities/Task.entity';
import { Miniboss } from 'src/domain/entities/miniboss.entity';

describe('UserIgnoreTask', () => {
    let userIgnoreTask: UserIgnoreTask;
    let userRepo: jest.Mocked<UserRepository>;
    let taskRepo: jest.Mocked<TaskRepository>;
    let bossRepo: jest.Mocked<MinibossRepository>;

    beforeEach(() => {
        userRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByPhone: jest.fn(),
            update: jest.fn(),
        };
        taskRepo = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            getTaskById: jest.fn(),
            update: jest.fn(),
            findOverdue: jest.fn(),
        };
        bossRepo = {
            save: jest.fn(),
            getUserById: jest.fn(),
            update: jest.fn(),
        };
        userIgnoreTask = new UserIgnoreTask(userRepo, taskRepo, bossRepo);
    });

    it('should process ignored task correctly', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };

        const user = new User('user-1', 'Test User', '1234567890', undefined, 0);
        const task = new Task(
            'task-1',
            'user-1',
            'Buy milk',
            'pending',
            'Buy milk from the store',
            0,
            new Date(),
            new Date()
        );
        const boss = new Miniboss('boss-1', 'user-1');

        userRepo.findById.mockResolvedValue(user);
        taskRepo.getTaskById.mockResolvedValue(task);
        bossRepo.getUserById.mockResolvedValue(boss);
        userRepo.update.mockResolvedValue(undefined);
        taskRepo.update.mockResolvedValue(undefined);
        bossRepo.update.mockResolvedValue(undefined);

        await userIgnoreTask.execute(input);

        expect(userRepo.findById).toHaveBeenCalledWith(input.userId);
        expect(taskRepo.getTaskById).toHaveBeenCalledWith(input.taskId);
        expect(bossRepo.getUserById).toHaveBeenCalledWith(input.userId);

        expect(user.timesIgnoring).toBe(1); // Assuming ignore() increments timesIgnoring
        expect(task.timesIgnored).toBe(1); // Assuming ignored() increments timesIgnored
        expect(boss.timesIgnored).toBe(1); // Assuming onIgnored() increments timesIgnored

        expect(userRepo.update).toHaveBeenCalledWith(user);
        expect(taskRepo.update).toHaveBeenCalledWith(task);
        expect(bossRepo.update).toHaveBeenCalledWith(boss);
    });

    it('should throw error if user not found', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
        userRepo.findById.mockResolvedValue(null);
        await expect(userIgnoreTask.execute(input)).rejects.toThrow('user not found.');
    });
});
