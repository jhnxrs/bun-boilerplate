import * as path from 'path'
import { promises as fs } from 'fs'
import { Migrator, FileMigrationProvider } from 'kysely'
import { logger } from 'src/common/logger';
import { db } from 'src/infra/database';

export const runDatabaseMigrations = async () => {
  try {
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(process.cwd(), 'migrations'),
      }),
    });

    const { error, results } = await migrator.migrateToLatest();

    results?.forEach((it) => {
      if (it.status === 'Success') {
        logger.info(`📦 Migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        logger.error(`📦 Failed to execute migration "${it.migrationName}"`);
      }
    });

    if (error) {
      logger.error(error);
      process.exit(1);
    }
  } catch (error) {
    logger.error(error);
  }
}