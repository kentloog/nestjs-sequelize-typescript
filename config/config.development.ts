export const config = {
    database: {
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'nest',
        logging: false,
        operatorsAliases: false,
    },
    jwtPrivateKey: 'jwtPrivateKey',
};
