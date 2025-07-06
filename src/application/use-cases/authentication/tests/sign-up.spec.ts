import { testContext } from "test/test-context";
import { expect, spyOn, test } from 'bun:test';
import Container from "typedi";
import { UserRepository } from "src/infra/database/repositories/user.repository";
import { SignUpUseCase } from "src/application/use-cases/authentication/sign-up.use-case";
import { OtpRepository } from "src/infra/database/repositories/otp.repository";

testContext("sign up", () => {
    test("should properly create the user and otp", async () => {
        const userRepository = Container.get(UserRepository);
        const otpRepository = Container.get(OtpRepository);

        const createOtpSpy = spyOn(otpRepository, 'create');

        const feature = Container.get(SignUpUseCase);

        const response = await feature.execute({
            email: 'john.doe@gmail.com'
        });

        const user = await userRepository.findBy('email', 'john.doe@gmail.com');
        expect(response.success).toBe(true);
        expect(user).not.toBe(null);
        expect(createOtpSpy).toHaveBeenCalled();
    });

    test("should not create the user because the email is duplicated", async () => {
        const userRepository = Container.get(UserRepository);
        const feature = Container.get(SignUpUseCase);

        await feature.execute({
            email: 'john.doe@gmail.com'
        });

        const user = await userRepository.findBy('email', 'john.doe@gmail.com');

        expect(user).not.toBe(null);

        await expect(feature.execute({
            email: 'john.doe@gmail.com'
        })).rejects.toThrow('Email already taken');
    });
})