import { UserDto } from './user.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../user.entity';

export class UserLoginResponseDto extends UserDto {
    @ApiModelProperty()
    token: string;

    constructor(user: User, token?: string) {
        super(user);
        this.token = token;
    }
}
