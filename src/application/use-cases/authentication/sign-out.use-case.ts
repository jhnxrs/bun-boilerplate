import { Service } from "typedi";
import type { Request as HttpRequest, Response as HttpResponse } from 'express';
import type Session from "src/domain/entities/session/entity";
import type { BaseUseCase } from "src/application/use-cases/base-use-case";
import { SessionRepository } from "src/infra/database/repositories/session.repository";
import { removeSession } from "src/infra/session";

type Params = {
    request: HttpRequest;
    response: HttpResponse;
    session: Session;
}

type Response = {
    success: boolean;
}

@Service()
export class SignOutUseCase implements BaseUseCase<Params, Response> {
    constructor(
        private readonly sessionRepository: SessionRepository,
    ) { }

    async execute(params: Params): Promise<Response> {
        const { session, request, response } = params;

        await this.sessionRepository.delete(session.id);
        await removeSession(request, response);

        return {
            success: true
        }
    }
}