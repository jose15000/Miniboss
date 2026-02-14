import { NotifyUser } from './NotifyUser';
import { MinibossRepository } from 'src/domain/repositories/minibossRepo';
import { TaskRepository } from 'src/domain/repositories/taskRepo';
import { UserRepository } from 'src/domain/repositories/userRepo';
import { AIService } from '../services/ai.service';
import { MessagingService } from '../services/messaging.service';
import { User } from 'src/domain/entities/user.entity';
import { Task } from 'src/domain/entities/Task.entity';
import { Miniboss } from 'src/domain/entities/miniboss.entity';

describe('NotifyUser', () => {
    let notifyUser: NotifyUser;
    let bossRepo: jest.Mocked<MinibossRepository>;
    let taskRepo: jest.Mocked<TaskRepository>;
    let userRepo: jest.Mocked<UserRepository>;
    let aiService: jest.Mocked<AIService>;
    let messagingService: jest.Mocked<MessagingService>;

    beforeEach(() => {
        bossRepo = {
            save: jest.fn(),
            getUserById: jest.fn(),
            update: jest.fn(),
        };
        taskRepo = {
            create: jest.fn(),
            findByUserId: jest.fn(),
            getTaskById: jest.fn(),
            update: jest.fn(),
            findOverdue: jest.fn(),
        };
        userRepo = {
            save: jest.fn(),
            findById: jest.fn(),
            findByPhone: jest.fn(),
            update: jest.fn(),
        };
        aiService = {
            parseTask: jest.fn(),
            detectIntent: jest.fn(),
            generateThreatMessage: jest.fn(),
        };
        messagingService = {
            send: jest.fn(),
        };
        notifyUser = new NotifyUser(bossRepo, taskRepo, userRepo, aiService, messagingService);
    });

    it('should notify user with threat message', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };

        const user = new User('user-1', 'Test User', '1234567890');
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
        const generatedMessage = "Do it now or else!";

        userRepo.findById.mockResolvedValue(user);
        taskRepo.getTaskById.mockResolvedValue(task);
        bossRepo.getUserById.mockResolvedValue(boss);
        aiService.generateThreatMessage.mockResolvedValue(generatedMessage);
        messagingService.send.mockResolvedValue(undefined);

        await notifyUser.execute(input);

        expect(userRepo.findById).toHaveBeenCalledWith(input.userId);
        expect(taskRepo.getTaskById).toHaveBeenCalledWith(input.taskId);
        expect(bossRepo.getUserById).toHaveBeenCalledWith(input.userId);

        expect(aiService.generateThreatMessage).toHaveBeenCalledWith(expect.objectContaining({
            bossHumor: 'neutral',
            taskTitle: 'Buy milk',
            timesIgnored: 0
        }));

        expect(messagingService.send).toHaveBeenCalledWith(user.number, generatedMessage);
    });

    it('should throw error if user/task/boss missing', async () => {
        const input = { userId: 'user-1', taskId: 'task-1' };
        userRepo.findById.mockResolvedValue(null);
        await expect(notifyUser.execute(input)).rejects.toThrow('User not found');
    });
});
