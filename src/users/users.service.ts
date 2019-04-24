import { CreateUserDto } from './dto/create-user.dto';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @Inject('UsersRepository')
        private readonly usersRepository: typeof User,
    ) {}

    private readonly users: CreateUserDto[] = [];

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.email = createUserDto.email.trim().toLowerCase();
        user.password = createUserDto.password;
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.gender = createUserDto.gender;
        user.birthday = createUserDto.birthday;

        try {
            return await user.save();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findAll(): CreateUserDto[] {
        return this.users;
    }
}
