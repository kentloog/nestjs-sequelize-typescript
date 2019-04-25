import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }
}
