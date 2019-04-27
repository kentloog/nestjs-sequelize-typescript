import { Post } from './post.entity';

export const postsProviders = [{ provide: 'PostsRepository', useValue: Post }];
