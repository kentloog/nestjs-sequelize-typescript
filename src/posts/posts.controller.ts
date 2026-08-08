import {
    Controller,
    Req,
    Body,
    Post,
    UseGuards,
    Get,
    Param,
    ParseIntPipe,
    Delete,
    Put,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { Post as PostEntity } from './post.entity';
import { User } from '../users/user.entity';
import { PostDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get()
    @ApiOkResponse({ type: [PostDto] })
    findAll(): Promise<PostDto[]> {
        return this.postsService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: PostDto })
    @ApiParam({ name: 'id', required: true })
    findOne(@Param('id', new ParseIntPipe()) id: number): Promise<PostDto> {
        return this.postsService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: PostEntity })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() createPostDto: CreatePostDto,
        @Req() request: { user: User },
    ): Promise<PostEntity> {
        return this.postsService.create(request.user.id, createPostDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: PostEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request: { user: User },
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.update(id, request.user.id, updatePostDto);
    }

    @Delete(':id')
    @ApiOkResponse({ type: PostEntity })
    @ApiParam({ name: 'id', required: true })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    delete(
        @Param('id', new ParseIntPipe()) id: number,
        @Req() request: { user: User },
    ): Promise<PostEntity> {
        return this.postsService.delete(id, request.user.id);
    }
}
