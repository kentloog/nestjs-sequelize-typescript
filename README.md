![Nest](assets/logo.png)

## Description

Starter kit project made with [Nest](https://github.com/nestjs/nest) that demonstrates CRUD user, JWT authentication, CRUD posts and e2e tests.

### Technologies implemented:

-   [NestJS](https://nestjs.com/) 11.x
-   [TypeScript](https://www.typescriptlang.org/) 5.7
-   [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) 2.x (ORM) + [Sequelize](https://sequelize.org/) 6.x
-   [PostgreSQL](https://www.postgresql.org/) 8.x driver (pg)
-   [JWT](https://jwt.io/) Authentication with [Passport](http://www.passportjs.org/)
-   [Jest](https://jestjs.io/) 30.x for testing
-   [Swagger](https://swagger.io/) 11.x for API documentation
-   [ESLint](https://eslint.org/) 9.x + [Prettier](https://prettier.io/) 3.x for code quality
-   [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 6.x for password hashing

## Prerequisites

-   [Node.js](https://nodejs.org/) (>= 20.0.0) - Required by NestJS 11
-   [npm](https://www.npmjs.com/) (>= 9.0.0)
-   [PostgreSQL](https://www.postgresql.org/) (>= 10.0.0) - Recommended >= 12.0.0 for best compatibility

## Installation

```bash
$ npm install
```

## Setting up the database for development and test

PostgreSQL database connection options are shown in the following table:

| Option   | Development | Test      |
| -------- | ----------- | --------- |
| Host     | localhost   | localhost |
| Port     | 5432        | 5432      |
| Username | postgres    | postgres  |
| Password | postgres    | postgres  |
| Database | nest        | nest_test |

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Other commands

```bash
# formatting code
$ npm run format

# run linter
$ npm run lint

# fix linting issues
$ npm run lint:fix

# unit tests
$ npm run test

# watch mode for tests
$ npm run test:watch

# test coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e

# debug tests
$ npm run test:debug

# create database
$ npm run db:create

# run migrations
$ npm run db:migrate

# run seeders
$ npm run db:seed-dev

# reset database
$ npm run db:reset

# drop database
$ npm run db:drop

```

## Run production configuration

```bash
# build the application
$ npm run build

# run in production mode
NODE_ENV=production \
DATABASE_HOST=db.host.com \
DATABASE_PORT=5432 \
DATABASE_USER=user \
DATABASE_PASSWORD=pass \
DATABASE_DATABASE=database \
JWT_PRIVATE_KEY=jwtPrivateKey \
npm run start:prod
```

## Swagger API docs

This project uses the Nest swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)  
Swagger docs will be available at localhost:3000/documentation
