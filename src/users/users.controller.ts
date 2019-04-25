import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
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

    @Post('login')
    @HttpCode(200)
    async login(
        @Body() userLoginRequestDto: UserLoginRequestDto,
    ): Promise<string> {
        return this.usersService.login(userLoginRequestDto);
    }

    @Get()
    @ApiOkResponse({ type: [UserDto] })
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }
}
