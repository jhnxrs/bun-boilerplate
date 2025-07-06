import type { BaseUseCase } from "src/application/use-cases/base-use-case";
import { BaseApplicationError } from "src/common/base-application-error";
import { config } from "src/common/config";
import { logger } from "src/common/logger";
import Otp from "src/domain/entities/otp/entity";
import User from "src/domain/entities/user/entity";
import { OtpRepository } from "src/infra/database/repositories/otp.repository";
import { UserRepository } from "src/infra/database/repositories/user.repository";
import { createTransaction } from "src/infra/database/utilities/create-transaction";
import { Service } from "typedi";

type Params = {
    email: string;
}

type Response = {
    success: boolean;
}

@Service()
export class SignUpUseCase implements BaseUseCase<Params, Response> {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly otpRepository: OtpRepository,
    ) { }

    async execute(params: Params): Promise<Response> {
        const { email } = params;

        const emailExists = await this.userRepository.findBy('email', email.toLowerCase());
        if (emailExists) throw new BaseApplicationError('Email already taken', 409, 'EMAIL_ALREADY_TAKEN');

        const user = User.create({
            email: email.toLowerCase(),
        });

        const otp = Otp.create({
            email: email.toLowerCase()
        });

        await createTransaction(async (tx) => {
            await this.userRepository.create(user, tx);
            await this.otpRepository.create(otp, tx);
        });

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