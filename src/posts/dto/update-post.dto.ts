import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsOptional } from 'class-validator';

export class UpdatePostDto {
    @IsOptional()
    @ApiProperty()
    @IsString()
    @Length(3, 60)
    readonly title: string;

    @IsOptional()
    @ApiProperty()
    @IsString()
    readonly content: string;
}
