export interface SequelizeOrmConfig {
    dialect: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging?: boolean;
    operatorsAliases?: boolean;
}
