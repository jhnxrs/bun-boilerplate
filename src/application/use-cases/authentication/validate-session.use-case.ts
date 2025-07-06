import { Service } from "typedi";
import type { Request as HttpRequest, Response as HttpResponse } from "express";
import type Session from "src/domain/entities/session/entity";
import type User from "src/domain/entities/user/entity";
import type { BaseUseCase } from "src/application/use-cases/base-use-case";
import { UserRepository } from "src/infra/database/repositories/user.repository";
import { SessionRepository } from "src/infra/database/repositories/session.repository";
import { getSession } from "src/infra/session";
import { BaseApplicationError } from "src/common/base-application-error";
import { utils } from "src/common/utils";

type Params = {
    request: HttpRequest;
    response: HttpResponse;
}

type Response = {
    session: Session;
    user: User;
};

@Service()
export class ValidateSessionUseCase implements BaseUseCase<Params, Response> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
    ) { }

    async execute(params: Params): Promise<Response> {
        const { request, response } = params;

        const session = await getSession(request, response);
        if (!session) throw new BaseApplicationError('Session is not valid', 401, 'INVALID_SESSION');

        const storedSession = await this.sessionRepository.findBy('token', session.token);
        if (!storedSession || storedSession.userId !== session.userId) throw new BaseApplicationError('Session is not valid', 401, 'INVALID_SESSION');

        const user = await this.userRepository.findBy('id', storedSession.userId);
        if (!user) throw new BaseApplicationError('Session is not valid', 401, 'INVALID_SESSION');

        let resultantSession: Session = storedSession;

        if (storedSession.shouldRefresh) {
            const updatedSession = storedSession.update({
                expiresAt: utils.dates.inFuture("days", 7)
            });

            resultantSession = updatedSession;

            await this.sessionRepository.update(updatedSession, ['expiresAt']);
        }

        return {
            user,
            session: resultantSession
        }
    }
}