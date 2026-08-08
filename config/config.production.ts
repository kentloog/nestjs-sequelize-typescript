import { Dialect } from 'sequelize';

export const config = {
    database: {
        dialect: 'postgres' as Dialect,
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
        logging: false,
    },
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
};
