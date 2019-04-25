import { Injectable } from '@nestjs/common';
import { SequelizeOrmConfig } from './interfaces/sequelize-orm-config.interface';
import { JwtConfig } from './interfaces/jwt-config.interface';
import config from '../../../config';

@Injectable()
export class ConfigService {
    get sequelizeOrmConfig(): SequelizeOrmConfig {
        return config.database;
    }

    get jwtConfig(): JwtConfig {
        return {
            privateKey: config.jwtPrivateKey,
        };
    }
}
