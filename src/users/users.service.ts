import { CreateUserDto } from './dto/create-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly users: CreateUserDto[] = [];

    create(user: CreateUserDto) {
        this.users.push(user);
    }

    findAll(): CreateUserDto[] {
        return this.users;
    }
}
