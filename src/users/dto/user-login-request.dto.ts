import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginRequestDto {
    @ApiModelProperty()
    @IsEmail()
    readonly email: string;

    @ApiModelProperty()
    @IsString()
    readonly password: string;
}
