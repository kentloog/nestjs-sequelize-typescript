import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { Controller, Get, Post, Body, HttpCode, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserLoginResponseDto } from './dto/user-login-response.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @ApiOkResponse({ type: UserLoginResponseDto })
    register(@Body() createUserDto: CreateUserDto): Promise<UserLoginResponseDto> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({ type: UserLoginResponseDto })
    login(@Body() userLoginRequestDto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
        return this.usersService.login(userLoginRequestDto);
    }

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: [UserDto] })
    findAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: UserDto })
    async getUser(@Req() request: { user: User }): Promise<UserDto> {
        return this.usersService.getUser(request.user.id);
    }

    @Put('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: UserDto })
    update(@Body() updateUserDto: UpdateUserDto, @Req() request: { user: User }): Promise<UserDto> {
        return this.usersService.update(request.user.id, updateUserDto);
    }

    @Delete('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: UserDto })
    delete(@Req() request: { user: User }): Promise<UserDto> {
        return this.usersService.delete(request.user.id);
    }
}
