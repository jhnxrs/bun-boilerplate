import { transform } from "src/common/transform";
import { Http } from "src/infra/http/contract";
import { isAuthenticated } from "src/infra/http/middleware/is-authenticated";

export const route: Http.Route = {
    method: Http.Method.GET,
    path: '/auth/session',
    middleware: [isAuthenticated],
    callback: async (request, response) => {
        return response.status(200).send({ user: transform.user({ entity: request.user, sensitive: false }) });
    }
}