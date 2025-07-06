export class BaseApplicationError extends Error {
    httpStatusCode: number;
    errorCode: string;
    silent: boolean;

    constructor(
        message: string,
        httpStatusCode: number = 500,
        errorCode: string = 'INTERNAL_SERVER_ERROR'
    ) {
        super(message);

        this.silent = true;
        this.httpStatusCode = httpStatusCode;
        this.errorCode = errorCode;
    }
}