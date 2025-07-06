import { SignInUseCase } from "src/application/use-cases/authentication/sign-in.use-case";
import { Http } from "src/infra/http/contract";
import Container from "typedi";
import { z } from 'zod';

const schema = z.object({
    email: z.string(),
    code: z.string().length(8)
});

export const route: Http.Route = {
    method: Http.Method.POST,
    path: '/auth/sign-in',
    schema,
    callback: async (request, response) => {
        const feature = Container.get(SignInUseCase);
        const result = await feature.execute({
            request,
            response,
            ...request.body,
        });

        return response.status(200).send(result);
    }
}