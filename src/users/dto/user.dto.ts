import { User } from './../user.entity';
import { Gender } from './../../shared/common/enum/gender';

export class UserDto {
    readonly id: string;

    readonly email: string;

    readonly firstName: string;

    readonly lastName: string;

    readonly gender: Gender;

    readonly birthday: string;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.gender = user.gender;
        this.birthday = user.birthday;
    }
}
