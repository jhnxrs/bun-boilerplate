import type { IOtp } from "src/domain/entities/otp/contract";
import type { ISession } from "src/domain/entities/session/contract";
import type { IUser } from "src/domain/entities/user/contract";
import type { Transaction } from "kysely";

export interface KyselyDatabase {
    user: IUser.Database;
    session: ISession.Database;
    otp: IOtp.Database;
}

export type KyselyTransaction = Transaction<KyselyDatabase>;