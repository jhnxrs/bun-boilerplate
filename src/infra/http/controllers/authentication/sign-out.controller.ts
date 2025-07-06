import { SignOutUseCase } from "src/application/use-cases/authentication/sign-out.use-case";
import { Http } from "src/infra/http/contract";
import { isAuthenticated } from "src/infra/http/middleware/is-authenticated";
import Container from "typedi";

export const route: Http.Route = {
    method: Http.Method.GET,
    path: '/auth/sign-out',
    middleware: [isAuthenticated],
    callback: async (request, response) => {
        const feature = Container.get(SignOutUseCase);
        const result = await feature.execute({
            request,
            response,
            session: request.session
        });

        return response.status(200).send(result);
    }
}