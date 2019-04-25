import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiUseTags, ApiOkResponse } from '@nestjs/swagger';

@Controller('users')
@ApiUseTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiOkResponse({ type: UserDto })
    register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOkResponse({ type: [UserDto] })
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }
}
