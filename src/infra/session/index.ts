import { config } from 'src/common/config';
import type { Request, Response } from 'express';
import { getIronSession, type SessionOptions } from 'iron-session';

type SessionProps = {
    token: string;
    userId: string;
}

const sessionTTL = 604800;

const sessionOptions: SessionOptions = {
    cookieName: 'produtin.auth',
    password: config.session_password,
    ttl: sessionTTL,
    cookieOptions: {
        httpOnly: true,
        secure: config.stage === 'development' ? false : true,
        sameSite: "lax",
        maxAge: sessionTTL - 60,
        path: "/",
        domain: config.stage === 'development' ? undefined : '.produtin.app',
    }
};

export const getSession = async (request: Request, response: Response): Promise<SessionProps | null> => {
    const session = await getIronSession<SessionProps>(request, response, sessionOptions);
    if (!session?.token) return null;

    return {
        token: session.token,
        userId: session.userId
    };
}

export const setSession = async (request: Request, response: Response, data: SessionProps): Promise<void> => {
    const session = await getIronSession<SessionProps>(request, response, sessionOptions);
    session.userId = data.userId;
    session.token = data.token;
    await session.save();
}

export const removeSession = async (request: Request, response: Response): Promise<void> => {
    const session = await getIronSession<SessionProps>(request, response, sessionOptions);
    session.destroy();
}