import { testContext } from "test/test-context";
import { expect, mock, test } from 'bun:test';
import Container from "typedi";
import { createUser } from "test/utilities/create-user";
import { createOtp } from "test/utilities/create-otp";
import { SessionRepository } from "src/infra/database/repositories/session.repository";
import { SignInUseCase } from "src/application/use-cases/authentication/sign-in.use-case";
import { transform } from "src/common/transform";
import { utils as utilsActual } from 'src/common/utils';

testContext("sign in", () => {
    test("should properly sign in", async () => {
        const sessionRepository = Container.get(SessionRepository);
        const feature = Container.get(SignInUseCase);

        const mockSetSession = mock(() => { });
        mock.module('src/infra/session', () => ({
            setSession: mockSetSession,
        }));

        mock.module('src/common/utils', () => {
            return {
                utils: {
                    ...utilsActual,
                    getUserIpFromRequest: () => '127.0.0.1',
                    getUserAgentFromRequest: () => 'Mozilla',
                }
            }
        });

        const user = await createUser();
        const otp = await createOtp({ email: user.email });

        const response = await feature.execute({
            code: otp.code,
            email: user.email,
            request: {} as any,
            response: {} as any
        });

        expect(response.user).toEqual(transform.user({ entity: user, sensitive: false }));

        const calls = mockSetSession.mock.calls as any[];
        expect(calls).toHaveLength(1);

        const userId = calls[0][2].userId;
        const token = calls[0][2].token;

        expect(userId).toBe(user.id);

        const session = await sessionRepository.findBy('token', token);

        expect(session).not.toBe(null);
    });

    test("should fail because user does not exist", async () => {
        const feature = Container.get(SignInUseCase);

        await expect(feature.execute({
            email: 'john.doe@gmail.com',
            code: '123123123',
            request: {} as any,
            response: {} as any
        })).rejects.toThrow('User not found');
    });

    test("should fail because otp is invalid (wrong code)", async () => {
        const feature = Container.get(SignInUseCase);

        const user = await createUser();
        await createOtp({ email: user.email, code: '11111111' });

        await expect(feature.execute({
            email: user.email,
            code: '22222222',
            request: {} as any,
            response: {} as any
        })).rejects.toThrow('Invalid otp code');
    });

    test("should fail because otp is invalid (expired)", async () => {
        const feature = Container.get(SignInUseCase);

        const user = await createUser();
        const otp = await createOtp({ email: user.email, expiresAt: new Date(Date.now() - 20 * 60 * 1000) });

        await expect(feature.execute({
            email: user.email,
            code: otp.code,
            request: {} as any,
            response: {} as any
        })).rejects.toThrow('Invalid otp code');
    });

    test("should fail because otp is invalid (already used)", async () => {
        const feature = Container.get(SignInUseCase);

        const user = await createUser();
        const otp = await createOtp({ email: user.email, isUsed: true });

        await expect(feature.execute({
            email: user.email,
            code: otp.code,
            request: {} as any,
            response: {} as any
        })).rejects.toThrow('Invalid otp code');
    });
})