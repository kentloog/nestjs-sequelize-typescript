import {
    IsString,
    IsEmail,
    IsEnum,
    IsISO8601,
    IsOptional,
    MinLength,
} from 'class-validator';
import { Gender } from './../../shared/enum/gender';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    readonly password: string;

    @ApiProperty()
    @IsString()
    readonly firstName: string;

    @ApiProperty()
    @IsString()
    readonly lastName: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(Gender)
    readonly gender: Gender;

    @ApiProperty()
    @IsOptional()
    @IsISO8601()
    readonly birthday: string;
}
