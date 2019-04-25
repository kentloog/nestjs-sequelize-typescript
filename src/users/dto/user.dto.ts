import { User } from './../user.entity';
import { Gender } from './../../shared/common/enum/gender';
import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiModelProperty()
    readonly id: string;

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly firstName: string;

    @ApiModelProperty()
    readonly lastName: string;

    @ApiModelProperty()
    readonly gender: Gender;

    @ApiModelProperty()
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
