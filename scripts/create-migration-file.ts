const createMigrationFile = async () => {
    const template = `
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {

}

export async function down(db: Kysely<any>): Promise<void> {

}
    `;
    const timestamp = new Date().getTime();
    const path = "migrations/" + timestamp + ".ts";
    await Bun.write(path, template.trim());
}

createMigrationFile();