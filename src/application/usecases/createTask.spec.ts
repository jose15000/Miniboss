import { CreateTask } from './createTask';
import { TaskRepository } from 'src/domain/repositories/taskRepo';
import { AIService } from '../services/ai.service';
import { Task } from 'src/domain/entities/Task.entity';
import { ParsedTask } from 'types/parsedTask';

describe('CreateTask', () => {
    let createTask: CreateTask;
    let taskRepo: jest.Mocked<TaskRepository>;
    let aiService: jest.Mocked<AIService>;

    beforeEach(() => {
        taskRepo = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            getTaskById: jest.fn(),
            update: jest.fn(),
            findOverdue: jest.fn(),
        };
        aiService = {
            parseTask: jest.fn(),
            detectIntent: jest.fn(),
            generateThreatMessage: jest.fn(),
        };
        createTask = new CreateTask(taskRepo, aiService);
    });

    it('should create a task successfully', async () => {
        const input = { userId: 'user-1', message: 'Buy milk' };
        const parsedTask: ParsedTask = {
            title: 'Buy milk',
            description: 'Buy milk from the store',
            estimatedMinutes: 30,
        };

        aiService.parseTask.mockResolvedValue(parsedTask);
        taskRepo.findByUserId.mockResolvedValue([]);
        taskRepo.create.mockResolvedValue(undefined);

        const result = await createTask.execute(input);

        expect(aiService.parseTask).toHaveBeenCalledWith(input.message);
        expect(taskRepo.create).toHaveBeenCalledWith(expect.any(Task));
        expect(result).toBeInstanceOf(Task);
        expect(result.name).toBe(parsedTask.title); // Fixed title -> name
        expect(result.userId).toBe(input.userId);
    });
});
