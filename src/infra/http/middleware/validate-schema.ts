import { BaseApplicationError } from "src/common/base-application-error";
import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";
import { fromError } from 'zod-validation-error';

export const validateSchema = (schema: AnyZodObject) => {
    return (request: Request, _: Response, next: NextFunction) => {
        try {
            schema.parse(request.body);
        } catch (err) {
            const validationError = fromError(err);

            let error = new BaseApplicationError('Invalid request payload', 400, 'INVALID_REQUEST_PAYLOAD');

            if (validationError) {
                error = new BaseApplicationError(validationError.toString(), 400, 'PAYLOAD_VALIDATION_FAILED');
            }

            return next(error);
        }

        return next();
    }
}