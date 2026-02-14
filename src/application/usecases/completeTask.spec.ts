import { CompleteTask } from './completeTask';
import { TaskRepository } from 'src/domain/repositories/taskRepo';
import { Task } from 'src/domain/entities/Task.entity';

describe('CompleteTask', () => {
    let completeTask: CompleteTask;
    let taskRepo: jest.Mocked<TaskRepository>;

    beforeEach(() => {
        taskRepo = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            getTaskById: jest.fn(),
            update: jest.fn(),
            findOverdue: jest.fn(),
        };
        completeTask = new CompleteTask(taskRepo);
    });

    it('should complete a task successfully', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
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

        taskRepo.findByUserId.mockResolvedValue([task]);
        taskRepo.update.mockResolvedValue(undefined);

        await completeTask.execute(input);

        expect(taskRepo.findByUserId).toHaveBeenCalledWith(input.userId);
        expect(task.status).toBe('done');
        expect(taskRepo.update).toHaveBeenCalledWith(task);
    });

    it('should throw error if task not found', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
        taskRepo.findByUserId.mockResolvedValue([]);

        await expect(completeTask.execute(input)).rejects.toThrow('Task not found');
    });
});
