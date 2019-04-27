import { Controller, Req, Body, Post, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
@ApiUseTags('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

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
