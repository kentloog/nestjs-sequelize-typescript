import { Sequelize } from 'sequelize-typescript';
import { User } from './../users/user.entity';
import { Post } from './../posts/post.entity';
import { ConfigService } from './../shared/config/config.service';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {
            const { database, username, password, dialect, host, port, logging } = configService.sequelizeOrmConfig;
            const sequelize = new Sequelize(
                database,
                username,
                password,
                {
                    dialect,
                    host,
                    port,
                    logging
                }
            );
            sequelize.addModels([User, Post]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
];
