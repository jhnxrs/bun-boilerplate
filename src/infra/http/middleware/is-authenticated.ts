import type { NextFunction, Request, Response } from 'express';
import { ValidateSessionUseCase } from 'src/application/use-cases/authentication/validate-session.use-case';
import Container from 'typedi';

export const isAuthenticated = async (request: Request, response: Response, next: NextFunction) => {
    try {
        console.time();
        const feature = Container.get(ValidateSessionUseCase);
        const result = await feature.execute({
            request,
            response
        });
        console.timeEnd();

        request.user = result.user;
        request.session = result.session;

        next();
    } catch (error) {
        next(error);
    }
}