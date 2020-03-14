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

    async findAll() {
        const posts = await this.postsRepository.findAll<Post>({
            include: [User],
        });
        return posts.map(post => new PostDto(post));
    }

    async findOne(id: number) {
        const post = await this.postsRepository.findByPk<Post>(id, {
            include: [User],
        });
        if (!post) {
            throw new HttpException('No post found', HttpStatus.NOT_FOUND);
        }
        return new PostDto(post);
    }

    async create(userId: string, createPostDto: CreatePostDto) {
        const post = new Post();
        post.userId = userId;
        post.title = createPostDto.title;
        post.content = createPostDto.content;
        return post.save();
    }

    private async getUserPost(id: number, userId: string) {
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

    async update(id: number, userId: string, updatePostDto: UpdatePostDto) {
        const post = await this.getUserPost(id, userId);
        post.title = updatePostDto.title || post.title;
        post.content = updatePostDto.content || post.content;
        return post.save();
    }

    async delete(id: number, userId: string) {
        const post = await this.getUserPost(id, userId);
        await post.destroy();
        return post;
    }
}
