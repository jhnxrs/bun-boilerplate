import type Session from "src/domain/entities/session/entity";
import type { IUser } from "src/domain/entities/user/contract";
import type User from "src/domain/entities/user/entity";
import type { KyselyTransaction } from "src/infra/database/types";

export namespace ISession {
    export type Database = WithDatabase<
        {
            userId: string;
            token: string;
            expiresAt: Date;
            ipAddress: string;
            userAgent: string;
        }
    >;

    export type Domain = WithDomain<Database> & {
        user?: User;
    };

    export type Restore = Database & {
        user?: IUser.Restore | null;
    };

    export type Create = Pick<
        Domain,
        'userId' |
        'ipAddress' |
        'userAgent'
    >;

    export type Update = Partial<
        Pick<
            Domain,
            'expiresAt'
        >
    >;

    export interface Repository {
        create: (e: Session, tx?: KyselyTransaction) => Promise<Session>;
        update: (e: Session, fields: (keyof Database)[], tx?: KyselyTransaction) => Promise<Session>;
        findBy: (column: 'id' | 'token', value: string, tx?: KyselyTransaction) => Promise<Session | null>;
        delete: (id: string, tx?: KyselyTransaction) => Promise<void>;
    };
}