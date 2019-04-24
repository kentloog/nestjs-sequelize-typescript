import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [],
})
export class UsersModule {}
