import { User } from './../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @Inject('PostsRepository')
        private readonly postsRepository: typeof Post,
    ) {}

    async findAll(): Promise<PostDto[]> {
        const posts = await this.postsRepository.findAll<Post>({
            include: [User],
        });
        return posts.map(post => {
            return new PostDto(post);
        });
    }

    async findOne(id: number): Promise<PostDto> {
        const post = await this.postsRepository.findByPk<Post>(id, {
            include: [User],
        });
        if (!post) {
            throw new HttpException('No post found', HttpStatus.NOT_FOUND);
        }

        return new PostDto(post);
    }

    async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
        const post = new Post();
        post.userId = userId;
        post.title = createPostDto.title;
        post.content = createPostDto.content;

        try {
            return await post.save();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async getUserPost(id: number, userId: string): Promise<Post> {
        const post = await this.postsRepository.findByPk<Post>(id);
        if (!post) {
            throw new HttpException('No post found', HttpStatus.NOT_FOUND);
        }

        if (post.userId !== userId) {
            throw new HttpException(
                'You are unauthorized to manage this post',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return post;
    }

    async update(
        id: number,
        userId: string,
        updatePostDto: UpdatePostDto,
    ): Promise<Post> {
        const post = await this.getUserPost(id, userId);

        post.title = updatePostDto.title;
        post.content = updatePostDto.content;

        try {
            return await post.save();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async delete(id: number, userId: string): Promise<Post> {
        const post = await this.getUserPost(id, userId);
        await post.destroy();
        return post;
    }
}
