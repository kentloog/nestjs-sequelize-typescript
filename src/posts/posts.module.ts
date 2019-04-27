import { DatabaseModule } from './../database/database.module';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { postsProviders } from './posts.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [PostsController],
    providers: [PostsService, ...postsProviders],
    exports: [],
})
export class PostsModule {}
