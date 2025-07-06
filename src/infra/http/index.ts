import { Service } from 'typedi';
import express, { type NextFunction, type Request, type Response, type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Glob } from 'bun';
import { Http } from 'src/infra/http/contract';
import { logger } from 'src/common/logger';
import path from 'path';
import { validateSchema } from 'src/infra/http/middleware/validate-schema';
import type { BaseApplicationError } from 'src/common/base-application-error';

type ModuleRouter = {
    route: Http.Route;
}

@Service()
export class HttpServer {
    private app: Express | null = null;

    private async attachRoutes() {
        if (!this.app) return;

        const glob = new Glob("src/infra/http/controllers/**/*.controller.ts");
        const routes: Http.Route[] = [];

        for await (const file of glob.scan(".")) {
            try {
                const relativePath = './' + path.relative(__dirname, path.resolve(file)).replace(/\.ts$/, '');
                const module: ModuleRouter = await import(relativePath);
                routes.push(module.route);
            } catch (error) {
                logger.error(`❌ Unable to initialize route for "${file}"`, error);
                process.exit(1);
            }
        }

        routes.forEach((route) => {
            const middleware = route.middleware || [];

            if (route.schema) {
                middleware.push(validateSchema(route.schema));
            }

            switch (route.method) {
                case Http.Method.GET:
                    (this.app as Express)
                        .get(route.path, ...middleware, async (request: Request, response: Response, next: NextFunction) => {
                            try {
                                await route.callback(request, response);
                            } catch (error) {
                                next(error);
                            }
                        });
                    break;
                case Http.Method.POST:
                    (this.app as Express)
                        .post(route.path, ...middleware, async (request: Request, response: Response, next: NextFunction) => {
                            try {
                                await route.callback(request, response);
                            } catch (error) {
                                next(error);
                            }
                        });
                    break;
                case Http.Method.DELETE:
                    (this.app as Express)
                        .delete(route.path, ...middleware, async (request: Request, response: Response, next: NextFunction) => {
                            try {
                                await route.callback(request, response);
                            } catch (error) {
                                next(error);
                            }
                        });
                    break;
                case Http.Method.PUT:
                    (this.app as Express)
                        .delete(route.path, ...middleware, async (request: Request, response: Response, next: NextFunction) => {
                            try {
                                await route.callback(request, response);
                            } catch (error) {
                                next(error);
                            }
                        });
                    break;
                default:
                    logger.error(`❌ Invalid http method provided for "${route.path}"`);
                    process.exit(1);
            }
        });
    }

    async init() {
        this.app = express();
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json({ limit: '8mb' }));
        this.app.use(express.urlencoded({ extended: false }));

        await this.attachRoutes();

        this.app.use((error: Error | BaseApplicationError, _: Request, response: Response, next: NextFunction) => {
            let message = (error as BaseApplicationError)?.message || 'Internal Server Error';

            response.status((error as BaseApplicationError)?.httpStatusCode || 500).json({
                errorCode: (error as BaseApplicationError)?.errorCode || 'INTERNAL_SERVER_ERROR',
                httpStatus: (error as BaseApplicationError)?.httpStatusCode || 500,
                message,
            });
        });

        const port = +(process.env.PORT || 3001);
        this.app.listen(port, '0.0.0.0');
        logger.info(`🚀 Http server listening on port: ${port}`);
    }
}