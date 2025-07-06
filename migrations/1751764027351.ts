import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable('user')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
        .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
        .addColumn('role', 'varchar(32)', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('otp')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
        .addColumn('email', 'varchar(255)', (col) => col.notNull())
        .addColumn('code', 'varchar(8)', (col) => col.notNull())
        .addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
        .addColumn('isUsed', 'boolean', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('session')
        .addColumn('id', 'uuid', (col) => col.primaryKey())
        .addColumn('createdAt', 'timestamptz', (col) => col.notNull())
        .addColumn('updatedAt', 'timestamptz', (col) => col.notNull())
        .addColumn('userId', 'uuid', (col) => col.notNull().references('user.id'))
        .addColumn('token', 'varchar(32)', (col) => col.notNull().unique())
        .addColumn('expiresAt', 'timestamptz', (col) => col.notNull())
        .addColumn('userAgent', 'text', (col) => col.notNull())
        .addColumn('ipAddress', 'varchar(32)', (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable('session').execute();
    await db.schema.dropTable('otp').execute();
    await db.schema.dropTable('user').execute();
}