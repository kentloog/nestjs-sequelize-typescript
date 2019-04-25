import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { genSalt, hash } from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: typeof User,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        try {
            const user = new User();
            user.email = createUserDto.email.trim().toLowerCase();
            user.firstName = createUserDto.firstName;
            user.lastName = createUserDto.lastName;
            user.gender = createUserDto.gender;
            user.birthday = createUserDto.birthday;

            const salt = await genSalt(10);
            user.password = await hash(createUserDto.password, salt);

            const userData = await user.save();
            return new UserDto(userData);
        } catch (err) {
            if (err.original.constraint === 'user_email_key') {
                throw new HttpException(
                    `User with email '${err.errors[0].value}' already exists`,
                    HttpStatus.CONFLICT,
                );
            }

            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(): Promise<UserDto[]> {
        const users = await this.usersRepository.findAll<User>();
        return users.map(user => {
            return new UserDto(user);
        });
    }
}
