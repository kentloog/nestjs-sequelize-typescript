import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
    constructor(
        @Inject('PostsRepository')
        private readonly postsRepository: typeof Post,
    ) {}

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
}
