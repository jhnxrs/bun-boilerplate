import type { BaseUseCase } from "src/application/use-cases/base-use-case";
import { BaseApplicationError } from "src/common/base-application-error";
import { config } from "src/common/config";
import { logger } from "src/common/logger";
import Otp from "src/domain/entities/otp/entity";
import { OtpRepository } from "src/infra/database/repositories/otp.repository";
import { UserRepository } from "src/infra/database/repositories/user.repository";
import { Service } from "typedi";

type Params = {
    email: string;
}

type Response = {
    success: boolean;
}

@Service()
export class SendOtpUseCase implements BaseUseCase<Params, Response> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
    ) { }

    async execute(params: Params): Promise<Response> {
        const { email } = params;

        const user = await this.userRepository.findBy('email', email.toLowerCase());
        if (!user) throw new BaseApplicationError('User not found', 404, 'USER_NOT_FOUND');

        const otp = Otp.create({
            email: email.toLowerCase()
        });

        await this.otpRepository.create(otp);

        if (config.stage === 'production') {
            // send otp email
        } else {
            logger.info(`🫣 OTP: ${otp.code}`);
        }

        return {
            success: true
        }
    }
}