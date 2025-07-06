import { logger } from "src/common/logger";
import { db } from "src/infra/database";
import type { KyselyTransaction } from "src/infra/database/types";

export const createTransaction = async<T>(callback: (tx: KyselyTransaction) => Promise<T>): Promise<T | undefined> => {
    try {
        return await db.transaction().execute(async (t) => {
            return await callback(t);
        });
    } catch (error) {
        logger.error(error);
        throw error;
    }
}