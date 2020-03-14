import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

export class PostDto {
    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly authorId: string;

    @ApiProperty()
    readonly authorFirstName: string;

    @ApiProperty()
    readonly authorLastName: string;

    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly content: string;

    @ApiProperty()
    readonly createdAt: Date;

    @ApiProperty()
    readonly updatedAt: Date;

    constructor(post: Post) {
        this.id = post.id;
        this.authorId = post.userId;
        this.authorFirstName = post.user.firstName;
        this.authorLastName = post.user.lastName;
        this.title = post.title;
        this.content = post.content;
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
    }
}
