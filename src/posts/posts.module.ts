import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [SequelizeModule.forFeature([Post]), UsersModule],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
