import 'reflect-metadata';
import { afterEach, beforeAll, describe } from "bun:test";
import { sql } from "kysely";
import { db } from "src/infra/database";
import { runDatabaseMigrations } from "src/infra/database/utilities/run-database-migrations";

export const testContext = (name: string, fn: () => void) => {
    describe(name, () => {
        // connect to the test database
        beforeAll(async () => {
            process.env.NODE_ENV = 'test';

            await sql`
                DROP SCHEMA public CASCADE;
                CREATE SCHEMA public;
            `.execute(db);

            await runDatabaseMigrations();
        });

        // clear the test database
        afterEach(async () => {
            await sql`
                DO
                $$
                DECLARE
                    r RECORD;
                BEGIN
                    -- Temporarily disable triggers if needed for truncation safety
                    -- or use truncate cascade
                    EXECUTE '
                    TRUNCATE TABLE ' ||
                    string_agg(format('%I', tablename), ', ') ||
                    ' CASCADE
                    '
                    FROM (
                        SELECT tablename
                        FROM pg_tables
                        WHERE schemaname = 'public'
                        AND tablename NOT IN ('kysely_migration', 'kysely_migration_lock')
                    ) AS t;
                END;
                $$;
            `.execute(db);
        });

        fn();
    });
}