import { testContext } from "test/test-context";
import { expect, spyOn, test } from 'bun:test';
import Container from "typedi";
import { createUser } from "test/utilities/create-user";
import { SendOtpUseCase } from "src/application/use-cases/authentication/send-otp.use-case";
import { OtpRepository } from "src/infra/database/repositories/otp.repository";

testContext("send otp", () => {
    test("should properly send otp", async () => {
        const feature = Container.get(SendOtpUseCase);
        const otpRepository = Container.get(OtpRepository);

        const createOtpSpy = spyOn(otpRepository, 'create');

        const user = await createUser();

        const response = await feature.execute({ email: user.email });

        expect(response).toEqual({ success: true });
        expect(createOtpSpy).toHaveBeenCalled();
    });

    test("should fail because user does not exist", async () => {
        const feature = Container.get(SendOtpUseCase);

        await expect(feature.execute({
            email: 'john.doe@gmail.com',
        })).rejects.toThrow('User not found');
    });
})