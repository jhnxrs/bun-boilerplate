import crypto from 'node:crypto';
import type { Request } from "express";

export const utils = {
    token: () => {
        return crypto.randomBytes(16).toString('hex');
    },
    random: {
        numberAsString: (length: number): string => {
            let result = '';
            for (let i = 0; i < length; i++) {
                const digit = Math.floor(Math.random() * 10); // 0–9
                result += digit.toString();
            }

            return result;
        }
    },
    dates: {
        inFuture: (unit: 'minutes' | 'hours' | 'days', amount: number): Date => {
            const now = new Date();
            let ms = 0;
            switch (unit) {
                case 'minutes':
                    ms = amount * 60 * 1000;
                    break;
                case 'hours':
                    ms = amount * 60 * 60 * 1000;
                    break;
                case 'days':
                    ms = amount * 24 * 60 * 60 * 1000;
                    break;
            }
            return new Date(now.getTime() + ms);
        }
    },
    pick: <T>(obj: T, ...fields: (keyof T)[]): Partial<T> => {
        const result: Partial<T> = {};
        fields.forEach((field) => {
            if (obj[field] !== undefined) {
                result[field] = obj[field];
            }
        });
        return result;
    },
    getUserIpFromRequest: (request: Request): string => {
        const forwardedFor = request.headers['x-forwarded-for'];

        if (typeof forwardedFor === 'string') {
            return forwardedFor?.split(',')?.[0]?.trim() || '0';
        }

        return request.connection.remoteAddress || request.ip || '0';
    },
    getUserAgentFromRequest: (request: Request): string => {
        const userAgent = request.get('User-Agent');
        return userAgent || 'Unknown';
    },
}