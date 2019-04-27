import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from 'src/shared/config/config.service';
import { Post } from './../src/posts/post.entity';
import { User } from './../src/users/user.entity';

describe('/', () => {
    let app: INestApplication;
    let sequelize: Sequelize;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
                {
                    provide: 'SEQUELIZE',
                    useFactory: (configService: ConfigService) => {
                        sequelize = new Sequelize(
                            configService.sequelizeOrmConfig,
                        );

                        sequelize.addModels([User, Post]);

                        return sequelize;
                    },
                    inject: [ConfigService],
                },
            ],
        }).compile();

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    afterAll(async done => {
        await app.close();
        await sequelize.drop();
        sequelize.close();
        done();
    });
});
