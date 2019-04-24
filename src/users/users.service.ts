import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly users: CreateUserDto[] = [];

    register(user: CreateUserDto) {
        this.users.push(user);
        return user;
    }

    findAll(): CreateUserDto[] {
        return this.users;
    }
}
