import { Module } from '@nestjs/common';
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ConfigService } from '../shared/config/config.service';

@Module({
    imports: [
        SequelizeModule.forFeature([User]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.jwtConfig.privateKey,
                signOptions: {
                    expiresIn: configService.jwtConfig.expiresIn as JwtSignOptions['expiresIn'],
                },
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService, JwtModule],
})
export class UsersModule {}
