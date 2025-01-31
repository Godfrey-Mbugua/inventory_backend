import { Hono } from 'hono';
import { registerUserController, loginUserController, verifyTokenController } from './auth.controller';
import { zValidator } from '@hono/zod-validator';
import { registerUserSchema, loginUserSchema } from '../validators';

export const authRouter = new Hono();

// Register a new user
authRouter.post('/register', 
    zValidator('json', registerUserSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    registerUserController
);

// Login a user
authRouter.post('/login', 
    zValidator('json', loginUserSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    loginUserController
);

// Verify a token
authRouter.get('/verify', verifyTokenController);