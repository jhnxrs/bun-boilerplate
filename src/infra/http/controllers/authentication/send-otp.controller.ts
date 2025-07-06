import { SendOtpUseCase } from "src/application/use-cases/authentication/send-otp.use-case";
import { Http } from "src/infra/http/contract";
import Container from "typedi";
import { z } from 'zod';

const schema = z.object({
    email: z.string()
});

export const route: Http.Route = {
    method: Http.Method.POST,
    path: '/auth/otp',
    schema,
    callback: async (request, response) => {
        const feature = Container.get(SendOtpUseCase);
        const result = await feature.execute(request.body);

        return response.status(200).send(result);
    }
}