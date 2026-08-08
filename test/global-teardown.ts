import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
    var __PGCONTAINER__: StartedPostgreSqlContainer | undefined;
}

export default async (): Promise<void> => {
    await globalThis.__PGCONTAINER__?.stop();
};
