import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';

@Module({
    imports: [UsersModule, PostsModule, SharedModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
