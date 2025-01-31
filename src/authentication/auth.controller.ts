import { Context } from 'hono';
import { registerUserService, loginUserService, verifyTokenService } from './auth.service';
import { loginUserSchema, registerUserSchema } from '../validators';

// Register a new user
export const registerUserController = async (c: Context) => {
    try {
        const result = registerUserSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const { username, email, password, role } = result.data;
        const message = await registerUserService(username, email, password, role);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error registering user:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Login a user
export const loginUserController = async (c: Context) => {
    try {
        const result = loginUserSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const { email, password } = result.data;
        const token = await loginUserService(email, password);
        return c.json({ token }, 200);
    } catch (error: any) {
        console.error("Error logging in user:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Verify a token
export const verifyTokenController = async (c: Context) => {
    try {
        const token = c.req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return c.json({ error: "Token is required" }, 400);
        }

        const user = verifyTokenService(token);
        if (!user) {
            return c.json({ error: "Invalid token" }, 401);
        }

        return c.json({ user }, 200);
    } catch (error: any) {
        console.error("Error verifying token:", error);
        return c.json({ error: error.message }, 400);
    }
};