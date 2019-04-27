import { ApiModelProperty } from '@nestjs/swagger';
import { Post } from '../post.entity';

export class PostDto {
    @ApiModelProperty()
    readonly id: number;

    @ApiModelProperty()
    readonly authorId: string;

    @ApiModelProperty()
    readonly authorFirstName: string;

    @ApiModelProperty()
    readonly authorLastName: string;

    @ApiModelProperty()
    readonly title: string;

    @ApiModelProperty()
    readonly content: string;

    @ApiModelProperty()
    readonly createdAt: Date;

    @ApiModelProperty()
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
