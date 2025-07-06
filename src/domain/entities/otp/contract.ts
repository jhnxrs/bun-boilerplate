import type Otp from "src/domain/entities/otp/entity";
import type { KyselyTransaction } from "src/infra/database/types";

export namespace IOtp {
    export type Database = WithDatabase<
        {
            email: string;
            expiresAt: Date;
            code: string;
            isUsed: boolean;
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
        'isUsed'
    >;

    export interface Repository {
        create: (e: Otp, tx?: KyselyTransaction) => Promise<Otp>;
        update: (e: Otp, fields: (keyof Database)[], tx?: KyselyTransaction) => Promise<Otp>;
        findUsable: (email: string, code: string, tx?: KyselyTransaction) => Promise<Otp | null>;
    }
}