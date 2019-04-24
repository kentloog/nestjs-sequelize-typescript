import { UsersService } from './users/users.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService],
})
export class AppModule {}
