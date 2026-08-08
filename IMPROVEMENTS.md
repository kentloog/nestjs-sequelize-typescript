# Improvement Ideas

Findings from a repo analysis on 2026-08-08. Ordered roughly by impact.
All items below were resolved by the 2026-08 tech-stack upgrade; kept as a record.

## 1. Hardcoded JWT secret in the strategy (bug) — Resolved

**Resolved:** Passport strategy removed entirely; `JwtModule.registerAsync` and the auth guard
both read the key from `ConfigService`, so signing and verification always use the same secret.

[src/users/auth/jwt-strategy.ts:12](src/users/auth/jwt-strategy.ts) uses the literal
`'jwtPrivateKey'` as `secretOrKey` instead of `ConfigService.jwtConfig.privateKey`.
Token **signing** ([src/users/users.service.ts](src/users/users.service.ts)) uses the
config value, but **verification** uses the hardcoded string — so setting
`JWT_PRIVATE_KEY` in production silently breaks all token verification.

**Fix:** inject `ConfigService` into `JwtStrategy` and pass
`configService.jwtConfig.privateKey` to `super()`.

## 2. JWTs never expire — Resolved

**Resolved:** tokens are signed with `expiresIn` from config (`JWT_EXPIRES_IN`, default `1d`).

[src/users/users.service.ts:121](src/users/users.service.ts) signs tokens with empty
options — no `expiresIn`. Tokens are valid forever.

**Fix:** add `expiresIn` (e.g. `'1d'`) to the sign options and make it configurable.

## 3. Fragile error handling in `UsersService.create` — Resolved

**Resolved:** `create` now checks `err instanceof UniqueConstraintError` and returns a generic
500 for unexpected errors.

[src/users/users.service.ts:62](src/users/users.service.ts) reads
`err.original.constraint`, which throws a `TypeError` if the error is not a Sequelize
unique-constraint violation (e.g. a connection error). The fallback also passes the raw
error object to `HttpException`, leaking internals to the client.

**Fix:** check `err instanceof UniqueConstraintError` (or guard with optional chaining)
and return a generic 500 message for unexpected errors.

## 4. `UsersService.delete` missing null check — Resolved

**Resolved:** `delete` now throws a 404 when `findByPk` returns null (surfaced by TS 6 strict mode).

[src/users/users.service.ts:110-114](src/users/users.service.ts) calls `user.destroy()`
without checking that `findByPk` found anything. Unlikely to trigger via `/users/me`
(the token guarantees a user), but a stale token after deletion would crash with a
`TypeError` instead of a 404.

**Fix:** add the same not-found check used in `getUser`/`update`.

## 5. `sequelize.sync()` alongside migrations — Resolved

**Resolved:** `sync()` dropped with the move to `@nestjs/sequelize`; migrations are the sole
schema mechanism everywhere, including the Testcontainers e2e setup.

[src/database/database.providers.ts](src/database/database.providers.ts) runs
`sequelize.sync()` at startup while the project also ships sequelize-cli migrations
([db/migrations/](db/migrations/)). Two competing schema-management mechanisms; `sync()`
can drift from migrations and is risky in production.

**Fix:** drop `sync()` and rely on migrations only (or gate `sync()` to dev/test).

## 6. Dev config database name doesn't match README — Resolved

**Resolved:** dev config now defaults to database `nest` (env-var overridable), matching the README.

[config/config.development.ts](config/config.development.ts) connects to database
`postgres`, while the README table documents `nest` for development.

**Fix:** align the config and README (probably change config to `nest`).

## 7. Housekeeping — Resolved

**Resolved:** `sequelize-cli` moved to `devDependencies`; `dist/` is gitignored and untracked.

- `sequelize-cli` sits in production `dependencies` in [package.json](package.json);
  it's a dev/ops tool and belongs in `devDependencies`.
- The compiled `dist/` directory is present in the working tree; ensure it's
  gitignored and not committed.
