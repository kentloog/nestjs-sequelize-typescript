import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from './../shared/config/config.service';

@Module({
    imports: [
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                ...configService.sequelizeOrmConfig,
                autoLoadModels: true,
                synchronize: false,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
