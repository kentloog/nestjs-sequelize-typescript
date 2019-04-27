![Nest](assets/logo.png)

## Description

Starter kit project made with [Nest](https://github.com/nestjs/nest)

### Technologies implemented:

-   [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) (ORM) + [PostgreSQL](https://www.postgresql.org/)
-   [JWT](https://jwt.io/)
-   [Jest](https://jestjs.io/)
-   [Swagger](https://swagger.io/)

## Prerequisites

-   [Node.js](https://nodejs.org/) (>= 10.8.0)
-   [npm](https://www.npmjs.com/) (>= 6.5.0)

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
