import { Controller, Req, Body, Post, UseGuards, Get } from '@nestjs/common';
import {
    ApiUseTags,
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostEntity } from './post.entity';
import { PostDto } from './dto/post.dto';

@Controller('posts')
@ApiUseTags('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @ApiOkResponse({ type: [PostDto] })
    findAll(): Promise<PostDto[]> {
        return this.postsService.findAll();
    }

    @Post()
    @ApiCreatedResponse({ type: PostEntity })
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    create(
        @Body() createPostDto: CreatePostDto,
        @Req() request,
    ): Promise<PostEntity> {
        return this.postsService.create(request.user.id, createPostDto);
    }
}
