import type { IOtp } from "src/domain/entities/otp/contract";
import Otp from "src/domain/entities/otp/entity";
import { db } from "src/infra/database";
import { createUser } from "test/utilities/create-user";

export const createOtp = async (props?: Partial<IOtp.Database>): Promise<Otp> => {
    const email = props?.email ?? (await createUser()).email;

    const base = Otp.create({
        email
    });

    const result = await db
        .insertInto('otp')
        .values({
            ...base.toPersistence(),
            ...props
        })
        .returningAll()
        .executeTakeFirst();

    if (!result) throw new Error('Unable to create otp');

    return Otp.restore(result);
}