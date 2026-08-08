import { Dialect } from 'sequelize';

export const config = {
    database: {
        dialect: 'postgres' as Dialect,
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: Number(process.env.DATABASE_PORT ?? 5432),
        username: process.env.DATABASE_USER ?? 'postgres',
        password: process.env.DATABASE_PASSWORD ?? 'postgres',
        database: process.env.DATABASE_DATABASE ?? 'nest',
        logging: false,
    },
    jwtPrivateKey: 'jwtPrivateKey',
    jwtExpiresIn: '1d',
};
