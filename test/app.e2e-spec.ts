import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

describe('/', () => {
    let app: INestApplication;
    let sequelize: Sequelize;
});
