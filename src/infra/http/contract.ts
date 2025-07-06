import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from 'zod';

export namespace Http {
    export enum Method {
        GET = 'post',
        POST = 'post',
        PUT = 'put',
        DELETE = 'delete'
    };

    export type Middleware = (request: Request, response: Response, next: NextFunction) => void;

    export type Route = {
        method: Method;
        path: string;
        middleware?: Middleware[];
        schema?: AnyZodObject;
        callback: (request: Request, response: Response) => Promise<Response>;
    }
}