import { utils } from "src/common/utils";
import type { ISession } from "src/domain/entities/session/contract";
import Session from "src/domain/entities/session/entity";
import { db } from "src/infra/database";
import { GenericDatabaseError } from "src/infra/database/errors/generic-database-error";
import type { KyselyTransaction } from "src/infra/database/types";
import { createQueryWrapper } from "src/infra/database/utilities/create-query-wrapper";
import { Service } from "typedi";

@Service()
export class SessionRepository implements ISession.Repository {
    async create(e: Session, tx?: KyselyTransaction): Promise<Session> {
        const initiator = tx || db;
        const props = e.toPersistence();

        const query = initiator
            .insertInto('session')
            .values(props)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                ...props,
                reference: 'session.create',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to create session', 'INSERT_SESSION_ERROR');

        return Session.restore(result);
    }

    async update(e: Session, fields: (keyof ISession.Database)[], tx?: KyselyTransaction): Promise<Session> {
        const initiator = tx || db;
        const props = utils.pick(e.toPersistence(), ...fields);

        const query = initiator
            .updateTable('session')
            .set({
                ...props,
                updatedAt: new Date(),
            })
            .where('session.id', '=', e.id)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                entity: e.toPersistence(),
                fields,
                reference: 'session.update',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to update session', 'UPDATE_SESSION_ERROR');

        return Session.restore(result);
    }

    async findBy(column: 'id' | 'token', value: string, tx?: KyselyTransaction): Promise<Session | null> {
        const initiator = tx || db;

        const query = initiator
            .selectFrom('session')
            .selectAll()
            .where(column, '=', value)
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                column,
                value,
                reference: 'session.findBy'
            }
        );

        if (!result) return null;

        return Session.restore(result);
    }

    async delete(id: string, tx?: KyselyTransaction): Promise<void> {
        const initiator = tx || db;

        const query = initiator
            .deleteFrom('session')
            .where('id', '=', id)
            .executeTakeFirst();

        await createQueryWrapper(
            query,
            {
                id,
                reference: 'session.delete'
            }
        );
    }
}