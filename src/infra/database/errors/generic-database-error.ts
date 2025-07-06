import { BaseApplicationError } from "src/common/base-application-error";

export class GenericDatabaseError extends BaseApplicationError {
    constructor(
        message: string = 'Internal Server Error',
        errorCode: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message, 500, errorCode);
    }
}