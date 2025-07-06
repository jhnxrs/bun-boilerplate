import type { IUser } from "src/domain/entities/user/contract";
import User from "src/domain/entities/user/entity";
import { db } from "src/infra/database";
import { faker } from '@faker-js/faker';

export const createUser = async (props?: Partial<IUser.Database>): Promise<User> => {
    const base = User.create({
        email: faker.internet.email(),
    });

    const result = await db
        .insertInto('user')
        .values({
            ...base.toPersistence(),
            ...props
        })
        .returningAll()
        .executeTakeFirst();

    if (!result) throw new Error('Unable to create user');

    return User.restore(result);
}