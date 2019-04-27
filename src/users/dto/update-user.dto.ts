import { Gender } from './../../shared/enum/gender';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsISO8601 } from 'class-validator';

export class UpdateUserDto {
    @ApiModelProperty()
    @IsOptional()
    @IsString()
    readonly firstName?: string;

    @ApiModelProperty()
    @IsOptional()
    @IsString()
    readonly lastName?: string;

    @ApiModelProperty()
    @IsOptional()
    @IsEnum(Gender)
    readonly gender?: Gender;

    @ApiModelProperty()
    @IsOptional()
    @IsISO8601()
    readonly birthday?: string;
}
