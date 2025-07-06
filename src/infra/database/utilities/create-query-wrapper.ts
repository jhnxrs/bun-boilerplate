import { logger } from "src/common/logger";

type Metadata = Record<string, any> & {
    reference: string; // query reference
}

/* -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
this is intended to verify long running queries
and also avoid queries of crashing when failing
-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */
export const createQueryWrapper = async<T>(query: Promise<T>, metadata: Metadata): Promise<T | undefined> => {
    try {
        const start = Date.now();
        const result = await query;
        const end = Date.now();

        const executionTimeMs = end - start;
        const maxExecutionTimeMsAllowed = 300; // queries should run in less than 300ms

        if (executionTimeMs > maxExecutionTimeMsAllowed) {
            logger.warning(`📦 Query took ${executionTimeMs}ms to execute`, metadata);
        }

        return result;
    } catch (error) {
        logger.error(error);
        logger.info(metadata);
        return undefined;
    }
}