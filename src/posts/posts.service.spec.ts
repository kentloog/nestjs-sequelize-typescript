import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

interface FakePost {
    id: number;
    userId: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: { firstName: string; lastName: string };
    save: jest.Mock;
    destroy: jest.Mock;
}

const buildPost = (overrides: Partial<FakePost> = {}): FakePost => ({
    id: 1,
    userId: 'owner-id',
    title: 'Original title',
    content: 'Original content',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-02T00:00:00Z'),
    user: { firstName: 'Jane', lastName: 'Doe' },
    save: jest.fn(),
    destroy: jest.fn(),
    ...overrides,
});

describe('PostsService', () => {
    let service: PostsService;

    const postsRepository = {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module = await Test.createTestingModule({
            providers: [PostsService, { provide: getModelToken(Post), useValue: postsRepository }],
        }).compile();

        service = module.get(PostsService);
    });

    describe('findAll', () => {
        it('returns all posts mapped to PostDto including author data', async () => {
            const post = buildPost();
            postsRepository.findAll.mockResolvedValue([post]);

            const result = await service.findAll();

            expect(postsRepository.findAll).toHaveBeenCalledWith({ include: [User] });
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(PostDto);
            expect(result[0]).toMatchObject({
                id: 1,
                authorId: 'owner-id',
                authorFirstName: 'Jane',
                authorLastName: 'Doe',
                title: 'Original title',
            });
        });
    });

    describe('findOne', () => {
        it('returns the post as a PostDto when found', async () => {
            const post = buildPost();
            postsRepository.findByPk.mockResolvedValue(post);

            const result = await service.findOne(1);

            expect(postsRepository.findByPk).toHaveBeenCalledWith(1, { include: [User] });
            expect(result).toBeInstanceOf(PostDto);
            expect(result.id).toBe(1);
        });

        it('throws a 404 HttpException when the post is not found', async () => {
            postsRepository.findByPk.mockResolvedValue(null);

            const promise = service.findOne(42);

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
        });
    });

    describe('update', () => {
        it('throws a 404 HttpException when the post is not found', async () => {
            postsRepository.findByPk.mockResolvedValue(null);

            const promise = service.update(42, 'owner-id', { title: 'New title' });

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
        });

        it('throws a 401 HttpException when the post belongs to another user', async () => {
            postsRepository.findByPk.mockResolvedValue(buildPost());

            const promise = service.update(1, 'someone-else', { title: 'New title' });

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED });
        });

        it('updates provided fields, keeps the rest and saves for the owner', async () => {
            const post = buildPost();
            post.save.mockResolvedValue(post);
            postsRepository.findByPk.mockResolvedValue(post);

            const result = await service.update(1, 'owner-id', { title: 'New title' });

            expect(post.title).toBe('New title');
            expect(post.content).toBe('Original content');
            expect(post.save).toHaveBeenCalledTimes(1);
            expect(result).toBe(post);
        });
    });

    describe('delete', () => {
        it('throws a 401 HttpException when the post belongs to another user', async () => {
            const post = buildPost();
            postsRepository.findByPk.mockResolvedValue(post);

            const promise = service.delete(1, 'someone-else');

            await expect(promise).rejects.toBeInstanceOf(HttpException);
            await expect(promise).rejects.toMatchObject({ status: HttpStatus.UNAUTHORIZED });
            expect(post.destroy).not.toHaveBeenCalled();
        });

        it('destroys the post and returns it for the owner', async () => {
            const post = buildPost();
            postsRepository.findByPk.mockResolvedValue(post);

            const result = await service.delete(1, 'owner-id');

            expect(post.destroy).toHaveBeenCalledTimes(1);
            expect(result).toBe(post);
        });
    });
});
