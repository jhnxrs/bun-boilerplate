import * as express from 'express';
import type Session from 'src/domain/entities/session/entity';
import type User from 'src/domain/entities/user/entity';

// Extend the Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user: User;
            session: Session;
        }
    }
}