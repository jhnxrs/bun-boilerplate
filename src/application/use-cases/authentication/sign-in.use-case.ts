import { Service } from "typedi";
import type { Request as HttpRequest, Response as HttpResponse } from 'express';
import type { TransformedUser } from "src/common/transform/user";
import type { BaseUseCase } from "src/application/use-cases/base-use-case";
import { UserRepository } from "src/infra/database/repositories/user.repository";
import { OtpRepository } from "src/infra/database/repositories/otp.repository";
import { SessionRepository } from "src/infra/database/repositories/session.repository";
import { BaseApplicationError } from "src/common/base-application-error";
import Session from "src/domain/entities/session/entity";
import { utils } from "src/common/utils";
import { setSession } from "src/infra/session";
import { transform } from "src/common/transform";

type Params = {
    request: HttpRequest;
    response: HttpResponse;
    email: string;
    code: string;
}

type Response = {
    user: TransformedUser;
    token: string;
}

@Service()
export class SignInUseCase implements BaseUseCase<Params, Response> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
        private readonly sessionRepository: SessionRepository,
    ) { }

    async execute(params: Params): Promise<Response> {
        const { request, response, email, code } = params;

        const user = await this.userRepository.findBy('email', email.toLowerCase());
        if (!user) throw new BaseApplicationError('User not found', 401, 'USER_NOT_FOUND');

        const otp = await this.otpRepository.findUsable(email.toLowerCase(), code);
        if (!otp) throw new BaseApplicationError('Invalid otp code', 401, 'INVALID_OTP_CODE');

        const session = Session.create({
            userId: user.id,
            ipAddress: utils.getUserIpFromRequest(request),
            userAgent: utils.getUserAgentFromRequest(request)
        });

        await this.sessionRepository.create(session);

        await setSession(
            request,
            response,
            {
                userId: user.id,
                token: session.token
            }
        );

        return {
            user: transform.user({ entity: user, sensitive: false }),
            token: session.token,
        }
    }
}