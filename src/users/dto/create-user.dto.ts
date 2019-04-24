import {
    IsString,
    IsEmail,
    IsEnum,
    IsISO8601,
    IsOptional,
} from 'class-validator';
import { Gender } from './../../shared/common/enum/gender';

export class CreateUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;

    @IsOptional()
    @IsEnum(Gender)
    readonly gender: Gender;

    @IsOptional()
    @IsISO8601()
    readonly birthday: string;
}
