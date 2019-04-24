import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    @Post()
    register(@Body() createUserDto: CreateUserDto): string {
        return 'This action adds a new user';
    }

    @Get()
    findAll(): string {
        return 'This action returns all users';
    }
}
