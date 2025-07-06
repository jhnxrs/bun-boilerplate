import type User from "src/domain/entities/user/entity";
import type { KyselyTransaction } from "src/infra/database/types";

export namespace IUser {
    export enum Role {
        User = 'user',
        Admin = 'admin'
    }

    export type Database = WithDatabase<
        {
            email: string;
            role: Role;
        }
    >;

    export type Domain = WithDomain<Database>;

    export type Restore = Database;

    export type Create = Pick<
        Domain,
        'email'
    >;

    export type Update = Pick<
        Domain,
        'role'
    >;

    export interface Repository {
        create: (e: User, tx?: KyselyTransaction) => Promise<User>;
        update: (e: User, fields: (keyof Database)[], tx?: KyselyTransaction) => Promise<User>;
        findBy: (column: 'id' | 'email', value: string, tx?: KyselyTransaction) => Promise<User | null>;
    }
}