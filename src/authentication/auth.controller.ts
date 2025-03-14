import { Context } from 'hono';
import { registerUserService, loginUserService, verifyTokenService } from './auth.service';
import { loginUserSchema, registerUserSchema } from '../validators';
import { Role } from './auth.service';
import { verify } from "jsonwebtoken";
import db from '../drizzle/db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUserController = async (c: Context) => {
    try {
        const result = registerUserSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const { username, email, password, role } = result.data as { username: string; email: string; password: string; role: Role };

        // Get the authorization header for all roles except admin creation
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
            return c.json({ error: "Authorization header is missing" }, 401);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return c.json({ error: "Authorization token is missing" }, 401);
        }

        const decoded = verify(token, JWT_SECRET) as unknown as { userId: number; role: string };

        const requestingUser = await db.query.UsersTable.findFirst({
            where: (users) => eq(users.userid, decoded.userId),
            columns: {
                role: true
            }
        });

        if (!requestingUser) {
            return c.json({ error: "Invalid user" }, 403);
        }

        // Only admin can create managers
        if (role === 'manager') {
            if (requestingUser.role !== 'admin') {
                return c.json({ error: "Only admins can create manager roles" }, 403);
            }
        }

        // Only managers can create cashier in and cashier out
        if (role === 'cashier in' || role === 'cashier out') {
            if (requestingUser.role !== 'manager') {
                return c.json({ error: "Only managers can create cashier roles" }, 403);
            }
        }

        const message = await registerUserService(username, email, password, role);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error registering user:", error);
        return c.json({ error: error.message }, 400);
    }
};

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