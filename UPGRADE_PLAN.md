# Tech Stack Upgrade Plan

Goal: bring every layer of the stack to the latest LTS/stable, modern-standard version.
Researched against official sources (nodejs.org, postgresql.org, npm registry, docs.nestjs.com,
sequelize.org, eslint.org, typescriptlang.org) on **2026-08-08**.

## Headline findings

| Layer | Current | Target | Why |
|---|---|---|---|
| Node.js | `>=20` (EOL since 2026-04-30!) | **24.x LTS** ("Krypton", EOL 2028-04-30) | Current Active LTS. Node 26 is not LTS until Oct 2026. |
| npm | `>=9` | **11.x** | Ships with Node 24. |
| PostgreSQL | README says >=10 | **18** (min supported: 15) | Latest stable (2025-09); PG 14 EOLs Nov 2026. |
| TypeScript | ^5.7.2 | **~6.0.x** — *not* 7.x | TS 7 (native/Go) has no compiler API: `nest build`, Swagger CLI plugin, and ts-jest don't work on it. TS 6.0 is the ceiling for NestJS today. |
| NestJS | ^11.0.0 | **11.1.28** (latest stable; no v12 yet) | v12 is alpha, targeting ~Q3 2026. Stay on 11, bump to latest. |
| Sequelize | ^6.37.5 | **6.37.8** (v7 still alpha) | `@sequelize/core` v7 is at alpha.48 — not production-ready. |
| Jest | ^30.0.0 | **30.4.2** (no v31) | In-range bump. |
| ESLint | ^9.17.0 | **10.x** | v9 EOL'd 2026-08-06 (two days ago). v10 is flat-config-only; repo already uses flat config. |
| Prettier | ^3.4.2 | **3.9.x** (no stable v4) | In-range bump; expect some reformat diffs. |

## Phase 1 — Runtime & infrastructure

1. **Node 24**: add `.nvmrc` containing `24`; set `engines` to `"node": ">=24.0.0"`, `"npm": ">=11.0.0"`.
   - Migration risk is low: OpenSSL 3.5 rejects weak TLS keys (<2048-bit RSA) — only matters if
     connecting to Postgres over SSL with old certs. Run `npm rebuild` after switching (bcrypt is a
     native addon).
2. **PostgreSQL 18**: update README (dev setup + prerequisites) to require >= 15, recommend 18.
   Local dev DBs should be recreated on 18.
3. Reinstall from scratch on Node 24 (`rm -rf node_modules package-lock.json && npm install`) to
   regenerate the lockfile with npm 11.

## Phase 2 — TypeScript 6 + modern tsconfig

1. Bump `typescript` to `~6.0.x`. Do **not** go to 7.x (no programmatic API; breaks `nest build`,
   ts-jest, Swagger plugin, type-aware ESLint).
2. Rewrite `tsconfig.json` to match the current NestJS scaffold + `@tsconfig/node-lts` (Node 24) base:
   - `module: "nodenext"`, `moduleResolution: "nodenext"`, `resolvePackageJsonExports: true`
   - `target: "ES2023"` (scaffold) — `es2024` also fine per node-lts base
   - `strict: true` (TS 6.0 default; replaces the current explicitly-false strict flags)
   - `isolatedModules: true`, `forceConsistentCasingInFileNames: true`, `skipLibCheck: true`
   - `"types": ["node"]` (TS 6 defaults `types` to `[]`)
   - **Remove `baseUrl`** (TS 6 removes it as a resolution root)
   - Keep `experimentalDecorators` + `emitDecoratorMetadata` (still required by NestJS DI and
     sequelize-typescript; fully supported in TS 6)
3. Fallout to expect and fix:
   - `strict: true` will surface null-safety errors across services/DTOs (e.g. the missing null
     check in `UsersService.delete` — see IMPROVEMENTS.md #4).
   - `nodenext` resolution may surface import-path issues in sequelize-typescript (predates
     exports-map strictness). Keep CJS emit — do **not** add `"type": "module"` to package.json.
4. Remove `tsconfig-paths` (no `paths` aliases are defined; drop `-r tsconfig-paths/register` from
   the `test:debug` script). Keep `ts-node` (Nest CLI uses it). Do **not** switch dev flow to
   tsx/Node native type-stripping — they can't emit decorator metadata. Optional: adopt the SWC
   builder (`@swc/cli` + `@swc/core`, ships in the current Nest scaffold) for faster dev builds.

## Phase 3 — NestJS ecosystem (stay on v11, latest patches)

1. Bump to latest v11 line: `@nestjs/common`/`core`/`platform-express`/`testing` **11.1.28**,
   `@nestjs/swagger` **11.4.6**, `@nestjs/passport` **11.0.5**, `@nestjs/cli` **11.0.24**,
   `@nestjs/schematics` **11.1.0**. All in-range (`^11`) — `npm update` level risk.
2. **Adopt `@nestjs/sequelize` 11.0.1** (official integration, Sequelize 6 compatible): replace the
   manual `'SEQUELIZE'` / `'UsersRepository'` / `'PostsRepository'` custom providers with
   `SequelizeModule.forRoot()` / `forFeature([User, Post])` + `@InjectModel()`. This is the modern
   idiomatic setup and removes `database.providers.ts` / `*.providers.ts` boilerplate.
   While here: drop `sequelize.sync()` in favor of migrations only (IMPROVEMENTS.md #5).
3. **Remove `swagger-ui-express`** — `@nestjs/swagger` bundles `swagger-ui-dist` since v5;
   `SwaggerModule.setup()` needs nothing extra.
4. Express 5 note: NestJS 11 already runs Express 5 (bundled 5.2.1). No wildcard/optional-param
   route patterns exist in this codebase, so no route-syntax changes needed. `@types/express`
   → **^5.0.6**.
5. Don't chase v12 yet, but note its direction for later: ESM-first, Vitest, Rspack.

## Phase 4 — Database stack (Sequelize v6 line)

| Package | Action |
|---|---|
| `sequelize` | bump to **6.37.8** (patches only) |
| `sequelize-typescript` | **2.1.6 is latest** — keep (dormant but functional; v7's built-in decorators replace it only when v7 goes GA) |
| `pg` | bump to **8.22.0** (no breaking changes; adds PG17+ `sslnegotiation`, Node 26 support) |
| `sequelize-cli` | bump to **6.6.5** and **move to devDependencies** |
| `@types/sequelize` | **delete** — deprecated stub; Sequelize 6 ships its own types (the v4-era types can conflict) |

## Phase 5 — Auth modernization (recommended, slightly bigger change)

Current NestJS docs no longer use Passport for JWT auth — the official pattern is **`@nestjs/jwt`
+ a custom `CanActivate` guard**. Passport/passport-jwt are ~3 years dormant upstream.

1. Add `@nestjs/jwt` **11.0.2**; replace raw `jsonwebtoken.sign()` with `JwtService.signAsync()`
   and the passport-jwt strategy with a small guard calling `jwtService.verifyAsync()`.
2. Remove: `passport`, `passport-jwt`, `jsonwebtoken`, `@nestjs/passport`, `@types/passport`,
   `@types/passport-jwt`, `@types/jsonwebtoken` (7 packages).
3. This forcibly fixes IMPROVEMENTS.md #1 (hardcoded JWT secret in the strategy — the guard reads
   the key from `ConfigService`/`JwtModule.register`) and is the natural place to add `expiresIn`
   (IMPROVEMENTS.md #2).
4. `bcrypt` 6.0.0 is current and fine (OWASP prefers argon2id for new systems — optional swap,
   not required; NestJS docs still show bcrypt).
5. Other bumps: `class-validator` → **^0.15.1** (explicit bump; only breaking change is the
   `IsIBAN` signature — unused here), `class-transformer` 0.5.1 stays (latest),
   `rxjs` → **7.8.2** (v8 was never released stable; v9 is beta — do not adopt),
   `reflect-metadata` 0.2.2 stays (still required), `@types/jsonwebtoken` → dropped with Phase 5,
   `@types/bcrypt` 6.0.0 stays.

*Fallback if we want zero behavior change:* keep Passport (still an official recipe), just bump
`jsonwebtoken` → 9.0.3 and fix the hardcoded secret.

## Phase 6 — Testing & code quality

1. **Jest**: bump in-range to 30.4.2; `ts-jest` → **29.4.12** (supports Jest 30 + TS 6, not TS 7);
   `supertest` → 7.2.2. `@types/jest` 30.0.0 already current. (Optional speed-up, also officially
   documented by NestJS: swap ts-jest transform for `@swc/jest`.)
2. **ESLint 10** (v9 is EOL as of 2026-08-06):
   - Bump `eslint` to ^10.x. Flat config is mandatory — repo already complies.
   - Replace `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` with the combined
     **`typescript-eslint`** package (^8.66.0, supports ESLint 10), using `tseslint.config()`.
   - Rewrite `eslint.config.mjs` to match the current Nest scaffold: `@eslint/js` recommended +
     `tseslint.configs.recommendedTypeChecked` + `eslint-plugin-prettier/recommended`, `globals`
     package for node/jest globals, and `projectService: true` instead of `parserOptions.project`.
     (Current config never enables any typescript-eslint preset and carries dead rules like
     `interface-name-prefix` — a rewrite is cleaner than patching.)
   - `eslint-config-prettier` → 10.1.8, `eslint-plugin-prettier` → 5.5.6 (keeping the plugin
     matches NestJS convention; typescript-eslint docs prefer running Prettier separately — either
     is defensible).
3. **Prettier** → 3.9.x; run `npm run format` once and commit the reformat separately.

## Phase 7 — Testcontainers for e2e tests

Replace the manually-provisioned `nest_test` database with a throwaway PostgreSQL container
started by the test suite itself (verified latest: **testcontainers 12.1.0** +
**@testcontainers/postgresql 12.1.0**, npm registry 2026-08-08).

1. Add devDependencies: `testcontainers` ^12.1.0, `@testcontainers/postgresql` ^12.1.0.
2. Wire into the e2e suite: a Jest `globalSetup` (or `beforeAll`) that runs
   `new PostgreSqlContainer('postgres:18').start()`, then exposes the container's
   host/port/user/password/database to the app config; `globalTeardown` stops it.
   Pin the image tag to the production Postgres major (`postgres:18`) so tests match prod.
3. **Prerequisite config change:** `ConfigService` currently hardcodes `localhost:5432` for
   non-production. Make the database config env-var-driven in all environments (env vars with
   dev defaults), so tests can inject the container's random port. This also cleans up the
   dev/prod config split generally.
4. Schema setup inside the container: run the sequelize-cli migrations programmatically (via
   umzug, which sequelize-cli uses under the hood) — or keep `sequelize.sync()` for tests only,
   consistent with Phase 3's "migrations are the source of truth" decision.
5. Jest adjustments: raise `testTimeout` for the e2e config (first run pulls the image);
   optionally enable Testcontainers' container-reuse for faster local iteration.
6. Requirements & CI: needs a Docker-compatible runtime locally (Docker Desktop, Colima,
   Podman, Rancher Desktop) and in CI (GitHub Actions ubuntu runners work out of the box).
   Document this in the README — it *replaces* the "set up a local test database" section.
7. Payoff: `npm run test:e2e` becomes a single self-contained command — no local Postgres,
   no shared-state flakiness, exact prod Postgres version, works identically in CI.

## Phase 8 — Verification

1. `npm run build` — clean compile under TS 6 / nodenext.
2. `npm run lint` — clean under ESLint 10 + typechecked preset.
3. `npm run test` and `npm run test:e2e` — e2e now runs against the Testcontainers-managed
   PostgreSQL 18 (dev database still needs recreating on 18 with migrations + seeders).
4. Manual smoke: `npm run start:dev`, exercise register/login/users/posts via Swagger at
   `/documentation`; confirm JWT auth works end-to-end (especially after Phase 5).
5. Update README: Node >= 24, npm >= 11, PostgreSQL >= 15 (rec. 18), version list, and the
   dev-database name mismatch (IMPROVEMENTS.md #6).
6. Ensure `dist/` is gitignored/untracked (IMPROVEMENTS.md #7).

## Suggested order & sizing

| Phase | Risk | Size |
|---|---|---|
| 1. Node 24 / npm 11 / PG 18 | Low | S |
| 4. Sequelize-stack bumps | Low | S |
| 3. Nest 11 latest + @nestjs/sequelize + drop swagger-ui-express | Medium | M |
| 2. TS 6 + strict tsconfig | Medium-high (strict-mode fixes) | M–L |
| 6. Jest/ESLint 10/Prettier | Medium (config rewrite) | M |
| 5. @nestjs/jwt auth migration | Medium (auth behavior) | M |
| 7. Testcontainers for e2e | Low-medium (test infra only) | M |
| 8. Verification + docs | — | S |

Phases 1 and 4 are safe to do together in one PR; each remaining phase deserves its own PR with
green tests before moving on.

## Explicitly NOT upgrading (and why)

- **TypeScript 7** — no compiler API; incompatible with `nest build`, ts-jest, Swagger plugin.
- **NestJS 12** — alpha only.
- **Sequelize 7 / @sequelize/core** — alpha only (alpha.48).
- **rxjs 8/9** — 8 never shipped stable, 9 is beta; Nest 11 requires ^7.1.
- **Prettier 4** — alpha only.
- **Jest 31** — doesn't exist; 30.x is current.
- **Node 26** — Current line, not LTS until Oct 2026.
