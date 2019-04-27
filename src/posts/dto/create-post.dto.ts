import { ApiModelProperty } from '@nestjs/swagger';
import { Length, IsString } from 'class-validator';

export class CreatePostDto {
    @ApiModelProperty()
    @IsString()
    @Length(3, 60)
    readonly title: string;

    @ApiModelProperty()
    @IsString()
    readonly content: string;
}
