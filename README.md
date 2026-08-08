![Nest](assets/logo.png)

# NestJS + Sequelize + TypeScript starter

A starter kit demonstrating a modern NestJS REST API: JWT authentication, users and posts
CRUD, schema migrations, Swagger docs, and a test setup with unit tests and self-contained
e2e tests (Testcontainers — no local test database needed).

## Tech stack

-   [NestJS](https://nestjs.com/) 11.x on [Node.js](https://nodejs.org/) 24 (LTS)
-   [TypeScript](https://www.typescriptlang.org/) 6.0 (strict)
-   [Sequelize](https://sequelize.org/) 6.x + [sequelize-typescript](https://github.com/RobinBuschmann/sequelize-typescript) via [@nestjs/sequelize](https://docs.nestjs.com/techniques/database#sequelize-integration)
-   [PostgreSQL](https://www.postgresql.org/) 18 with the [node-postgres](https://node-postgres.com/) driver
-   JWT authentication with [@nestjs/jwt](https://github.com/nestjs/jwt) + [bcrypt](https://github.com/kelektiv/node.bcrypt.js) password hashing
-   [Swagger](https://swagger.io/) API docs via [@nestjs/swagger](https://github.com/nestjs/swagger)
-   [Jest](https://jestjs.io/) 30.x + [Testcontainers](https://testcontainers.com/) for testing
-   [ESLint](https://eslint.org/) 10.x + [Prettier](https://prettier.io/) for code quality

## Prerequisites

-   [Node.js](https://nodejs.org/) >= 24 and npm >= 11 (`.nvmrc` is included — `nvm use`)
-   [PostgreSQL](https://www.postgresql.org/) >= 15 (recommended: 18) for local development
-   A Docker-compatible runtime (Docker Desktop, Colima, Podman, ...) — only needed for the e2e tests

## Quick start

```bash
nvm use
npm install

# create the database and schema (defaults: postgres/postgres@localhost:5432, database "nest")
npm run db:create
npm run db:migrate

# optional: seed sample users
npm run db:seed-dev

# run in watch mode
npm run start:dev
```

The API is now available at http://localhost:3000 and the Swagger UI at
[http://localhost:3000/documentation](http://localhost:3000/documentation).

> **Note:** the application does not create or alter tables at startup — migrations are the
> single source of truth for the schema. Run `npm run db:migrate` after pulling changes that
> add migrations.

## Configuration

All settings are environment variables with development defaults:

| Variable            | Default (development) | Description                              |
| ------------------- | --------------------- | ---------------------------------------- |
| `NODE_ENV`          | `development`         | `production` enables the production config |
| `DATABASE_HOST`     | `localhost`           | PostgreSQL host                          |
| `DATABASE_PORT`     | `5432`                | PostgreSQL port                          |
| `DATABASE_USER`     | `postgres`            | PostgreSQL user                          |
| `DATABASE_PASSWORD` | `postgres`            | PostgreSQL password                      |
| `DATABASE_DATABASE` | `nest`                | Database name                            |
| `JWT_PRIVATE_KEY`   | `jwtPrivateKey`       | Secret used to sign and verify JWTs — **set a real secret in production** |
| `JWT_EXPIRES_IN`    | `1d`                  | Token lifetime (e.g. `15m`, `12h`, `7d`) |

In production (`NODE_ENV=production`) there are no defaults — the `DATABASE_*` and `JWT_*`
variables must be provided explicitly.

## API overview

| Method   | Endpoint          | Auth   | Description                          |
| -------- | ----------------- | ------ | ------------------------------------ |
| `POST`   | `/users/register` | —      | Register a new user, returns a JWT   |
| `POST`   | `/users/login`    | —      | Log in, returns a JWT                |
| `GET`    | `/users`          | Bearer | List all users                       |
| `GET`    | `/users/me`       | Bearer | Get the authenticated user           |
| `PUT`    | `/users/me`       | Bearer | Update the authenticated user        |
| `DELETE` | `/users/me`       | Bearer | Delete the authenticated user        |
| `GET`    | `/posts`          | —      | List all posts                       |
| `GET`    | `/posts/:id`      | —      | Get a single post                    |
| `POST`   | `/posts`          | Bearer | Create a post                        |
| `PUT`    | `/posts/:id`      | Bearer | Update your own post                 |
| `DELETE` | `/posts/:id`      | Bearer | Delete your own post                 |

Register or log in to receive a token, then send it as `Authorization: Bearer <token>`
(in Swagger UI: the **Authorize** button).

## Testing

```bash
# unit tests
npm run test

# e2e tests (requires a running Docker daemon)
npm run test:e2e

# coverage
npm run test:cov
```

The e2e suite is fully self-contained: [Testcontainers](https://testcontainers.com/) starts a
throwaway PostgreSQL 18 container, runs the migrations against it, and removes it afterwards.
No test database setup is required, and it works out of the box on GitHub Actions ubuntu
runners.

## All scripts

| Script                              | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `npm run start` / `start:dev` / `start:debug` | Run the app (once / watch mode / debugger attached) |
| `npm run build` + `npm run start:prod` | Compile to `dist/` and run the compiled app     |
| `npm run test` / `test:watch` / `test:cov` / `test:debug` | Unit tests                   |
| `npm run test:e2e`                  | End-to-end tests (Testcontainers)                  |
| `npm run lint` / `lint:fix`         | Lint (and auto-fix)                                |
| `npm run format`                    | Format with Prettier                               |
| `npm run db:create` / `db:drop`     | Create / drop the database                         |
| `npm run db:migrate`                | Apply pending migrations                           |
| `npm run db:seed-dev`               | Seed development sample data                       |
| `npm run db:reset`                  | Drop, recreate, migrate, and seed                  |

## Running in production

```bash
npm run build

NODE_ENV=production \
DATABASE_HOST=db.host.com \
DATABASE_PORT=5432 \
DATABASE_USER=user \
DATABASE_PASSWORD=pass \
DATABASE_DATABASE=database \
JWT_PRIVATE_KEY=<strong-secret> \
JWT_EXPIRES_IN=1d \
npm run start:prod
```

Remember to run the migrations against the production database as part of your deploy
(`npm run db:migrate` with the same `DATABASE_*` environment variables).

## License

[MIT](package.json)
