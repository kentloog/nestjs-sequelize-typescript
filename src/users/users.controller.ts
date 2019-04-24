import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    register(@Body() createUserDto: CreateUserDto): CreateUserDto {
        return this.usersService.register(createUserDto);
    }

    @Get()
    findAll(): CreateUserDto[] {
        return this.usersService.findAll();
    }
}
