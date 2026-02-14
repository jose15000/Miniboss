import { CheckOverdueTask } from './checkOverdueTask';
import { TaskRepository } from 'src/domain/repositories/taskRepo';
import { MinibossRepository } from 'src/domain/repositories/minibossRepo';
import { Task } from 'src/domain/entities/Task.entity';
import { Miniboss } from 'src/domain/entities/miniboss.entity';

describe('CheckOverdueTask', () => {
    let checkOverdueTask: CheckOverdueTask;
    let taskRepo: jest.Mocked<TaskRepository>;
    let bossRepo: jest.Mocked<MinibossRepository>;

    beforeEach(() => {
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
        checkOverdueTask = new CheckOverdueTask(taskRepo, bossRepo);
    });

    it('should decrease boss patience if task is overdue', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
        const pastDate = new Date();
        pastDate.setMinutes(pastDate.getMinutes() - 60); // 1 hour ago

        const task = new Task(
            'task-1',
            'user-1',
            'Buy milk',
            'pending',
            'Buy milk from the store',
            0,
            pastDate, // created
            pastDate // deadline (overdue)
        );

        const boss = new Miniboss(
            'boss-1',
            'user-1',
            'neutral',
            10,
            0
        );

        taskRepo.findByUserId.mockResolvedValue([task]);
        bossRepo.getUserById.mockResolvedValue(boss);
        bossRepo.update.mockResolvedValue(undefined);

        await checkOverdueTask.execute(input);

        expect(bossRepo.getUserById).toHaveBeenCalledWith(input.userId);
        expect(boss.patience).toBe(9); // Initial 10 - 1
        expect(bossRepo.update).toHaveBeenCalledWith(boss);
    });

    it('should not decrease boss patience if task is NOT overdue', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
        const futureDate = new Date();
        futureDate.setMinutes(futureDate.getMinutes() + 60); // 1 hour future

        const task = new Task(
            'task-1',
            'user-1',
            'Buy milk',
            'pending',
            'Buy milk from the store',
            0,
            new Date(),
            futureDate
        );

        const boss = new Miniboss(
            'boss-1',
            'user-1',
            'neutral',
            10,
            0
        );

        taskRepo.findByUserId.mockResolvedValue([task]);
        bossRepo.getUserById.mockResolvedValue(boss);

        await checkOverdueTask.execute(input);

        expect(boss.patience).toBe(10);
        expect(bossRepo.update).not.toHaveBeenCalled();
    });
});
