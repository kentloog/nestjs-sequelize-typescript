import { User } from './user.entity';

export const usersProviders = [{ provide: 'UsersRepository', useValue: User }];
