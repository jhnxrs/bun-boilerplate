import { config } from "src/common/config";
import type { KyselyDatabase } from "src/infra/database/types";
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg";

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: process.env.NODE_ENV === 'test' ? config.test_database_uri : config.database_uri,
        max: +config.max_database_connections,
    })
});

export const db = new Kysely<KyselyDatabase>({
    dialect,
});