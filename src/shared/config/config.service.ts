import { Injectable } from '@nestjs/common';
import { JwtConfig } from './interfaces/jwt-config.interface';
import config from '../../../config';

@Injectable()
export class ConfigService {
    get sequelizeOrmConfig() {
        return config.database;
    }

    get jwtConfig(): JwtConfig {
        return {
            privateKey: config.jwtPrivateKey,
        };
    }
}
