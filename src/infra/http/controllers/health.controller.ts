import { Http } from "src/infra/http/contract";

export const route: Http.Route = {
    method: Http.Method.GET,
    path: '/health',
    callback: async (_, response) => {
        return response.status(200).send({ status: 'ok', message: '🚀 Server is up!' });
    }
}