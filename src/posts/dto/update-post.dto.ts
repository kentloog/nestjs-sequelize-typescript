import { ApiModelProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @ApiModelProperty()
    @IsString()
    @Length(3, 60)
    readonly title: string;

    @IsOptional()
    @ApiModelProperty()
    @IsString()
    readonly content: string;
}
