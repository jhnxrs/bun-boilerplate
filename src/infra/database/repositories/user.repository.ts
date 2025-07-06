import { utils } from 'src/common/utils';
import type { IUser } from 'src/domain/entities/user/contract';
import User from 'src/domain/entities/user/entity';
import { db } from 'src/infra/database';
import { GenericDatabaseError } from 'src/infra/database/errors/generic-database-error';
import type { KyselyTransaction } from 'src/infra/database/types';
import { createQueryWrapper } from 'src/infra/database/utilities/create-query-wrapper';
import { Service } from 'typedi';

@Service()
export class UserRepository implements IUser.Repository {
    async create(e: User, tx?: KyselyTransaction): Promise<User> {
        const initiator = tx || db;
        const props = e.toPersistence();

        const query = initiator
            .insertInto('user')
            .values(props)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                ...props,
                reference: 'user.create',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to create user', 'INSERT_USER_ERROR');

        return User.restore(result);
    }

    async update(e: User, fields: (keyof IUser.Database)[], tx?: KyselyTransaction): Promise<User> {
        const initiator = tx || db;
        const props = utils.pick(e.toPersistence(), ...fields);

        const query = initiator
            .updateTable('user')
            .set({
                ...props,
                updatedAt: new Date(),
            })
            .where('user.id', '=', e.id)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                entity: e.toPersistence(),
                fields,
                reference: 'user.update',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to update user', 'UPDATE_USER_ERROR');

        return User.restore(result);
    }

    async findBy(column: 'id' | 'email', value: string, tx?: KyselyTransaction): Promise<User | null> {
        const initiator = tx || db;

        const query = initiator
            .selectFrom('user')
            .selectAll()
            .where(column, '=', value)
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                column,
                value,
                reference: 'user.findBy'
            }
        );

        if (!result) return null;

        return User.restore(result);
    }
}