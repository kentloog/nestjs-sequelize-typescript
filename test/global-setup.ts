import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execFileSync } from 'child_process';
import { join } from 'path';

declare global {
    var __PGCONTAINER__: StartedPostgreSqlContainer | undefined;
}

export default async (): Promise<void> => {
    const container = await new PostgreSqlContainer('postgres:18').start();

    process.env.DATABASE_HOST = container.getHost();
    process.env.DATABASE_PORT = String(container.getPort());
    process.env.DATABASE_USER = container.getUsername();
    process.env.DATABASE_PASSWORD = container.getPassword();
    process.env.DATABASE_DATABASE = container.getDatabase();

    globalThis.__PGCONTAINER__ = container;

    execFileSync(process.execPath, [require.resolve('sequelize-cli/lib/sequelize'), 'db:migrate'], {
        cwd: join(__dirname, '..'),
        stdio: 'inherit',
    });
};
