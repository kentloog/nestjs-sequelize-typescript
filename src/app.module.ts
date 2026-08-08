import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [SharedModule, DatabaseModule, UsersModule, PostsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
