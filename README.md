![Nest](assets/logo.png)

## Description

Starter kit project made with [Nest](https://github.com/nestjs/nest) that demonstrates CRUD user, JWT authentication, CRUD posts and e2e tests.

### Technologies implemented:

-   [NestJS](https://nestjs.com/) 11.x
-   [TypeScript](https://www.typescriptlang.org/) 6.0
-   [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) 2.x (ORM) + [Sequelize](https://sequelize.org/) 6.x
-   [PostgreSQL](https://www.postgresql.org/) 18 with the [node-postgres](https://node-postgres.com/) driver (pg 8.x)
-   [JWT](https://jwt.io/) Authentication with [@nestjs/jwt](https://github.com/nestjs/jwt)
-   [Jest](https://jestjs.io/) 30.x + [Testcontainers](https://testcontainers.com/) for testing
-   [Swagger](https://swagger.io/) 11.x for API documentation
-   [ESLint](https://eslint.org/) 10.x + [Prettier](https://prettier.io/) 3.9 for code quality
-   [bcrypt](https://github.com/kelektiv/node.bcrypt.js) 6.x for password hashing

## Prerequisites

-   [Node.js](https://nodejs.org/) (>= 24.0.0) - Current LTS
-   [npm](https://www.npmjs.com/) (>= 11.0.0)
-   [PostgreSQL](https://www.postgresql.org/) (>= 15) - Recommended 18
-   A Docker-compatible runtime (e.g. [Docker Desktop](https://www.docker.com/products/docker-desktop/)) - for the e2e tests

## Installation

```bash
$ npm install
```

## Setting up the database for development

PostgreSQL database connection options for development are shown in the following table
(each can be overridden with the corresponding `DATABASE_*` environment variable):

| Option   | Development | Environment variable |
| -------- | ----------- | -------------------- |
| Host     | localhost   | DATABASE_HOST        |
| Port     | 5432        | DATABASE_PORT        |
| Username | postgres    | DATABASE_USER        |
| Password | postgres    | DATABASE_PASSWORD    |
| Database | nest        | DATABASE_DATABASE    |

No test database setup is needed: the e2e suite uses
[Testcontainers](https://testcontainers.com/) to start a throwaway PostgreSQL 18 container,
run the migrations against it, and remove it afterwards. `npm run test:e2e` only requires a
running Docker-compatible runtime (Docker Desktop, Colima, Podman, Rancher Desktop — GitHub
Actions ubuntu runners work out of the box).

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
JWT_EXPIRES_IN=1d \
npm run start:prod
```

## Swagger API docs

This project uses the Nest swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)  
Swagger docs will be available at localhost:3000/documentation
