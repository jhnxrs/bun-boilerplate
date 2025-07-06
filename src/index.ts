import 'reflect-metadata';
import { HttpServer } from 'src/infra/http';
import Container from 'typedi';

const bootstrap = async () => {
    const httpServer = Container.get(HttpServer);
    await httpServer.init();
}

bootstrap();