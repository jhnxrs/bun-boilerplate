import { utils } from 'src/common/utils';
import type { IOtp } from 'src/domain/entities/otp/contract';
import Otp from 'src/domain/entities/otp/entity';
import { db } from 'src/infra/database';
import { GenericDatabaseError } from 'src/infra/database/errors/generic-database-error';
import type { KyselyTransaction } from 'src/infra/database/types';
import { createQueryWrapper } from 'src/infra/database/utilities/create-query-wrapper';
import { Service } from 'typedi';

@Service()
export class OtpRepository implements IOtp.Repository {
    async create(e: Otp, tx?: KyselyTransaction): Promise<Otp> {
        const initiator = tx || db;
        const props = e.toPersistence();

        const query = initiator
            .insertInto('otp')
            .values(props)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                ...props,
                reference: 'otp.create',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to create otp', 'INSERT_OTP_ERROR');

        return Otp.restore(result);
    }

    async update(e: Otp, fields: (keyof IOtp.Database)[], tx?: KyselyTransaction): Promise<Otp> {
        const initiator = tx || db;
        const props = utils.pick(e.toPersistence(), ...fields);

        const query = initiator
            .updateTable('otp')
            .set({
                ...props,
                updatedAt: new Date(),
            })
            .where('otp.id', '=', e.id)
            .returningAll()
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                entity: e.toPersistence(),
                fields,
                reference: 'otp.update',
            }
        );

        if (!result) throw new GenericDatabaseError('Unable to update otp', 'UPDATE_OTP_ERROR');

        return Otp.restore(result);
    }

    async findUsable(email: string, code: string, tx?: KyselyTransaction): Promise<Otp | null> {
        const initiator = tx || db;

        const query = initiator
            .selectFrom('otp')
            .selectAll()
            .where('otp.email', '=', email.toLowerCase())
            .where('otp.code', '=', code)
            .where('otp.isUsed', '=', false)
            .where('otp.expiresAt', '>', new Date())
            .executeTakeFirst();

        const result = await createQueryWrapper(
            query,
            {
                email,
                code,
                reference: 'otp.findUsable'
            }
        );

        if (!result) return null;

        return Otp.restore(result);
    }
}