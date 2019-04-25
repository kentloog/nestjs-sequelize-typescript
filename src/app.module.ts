import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';

@Module({
    imports: [UsersModule, SharedModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
