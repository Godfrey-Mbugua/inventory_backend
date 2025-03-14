import { Context, Next } from "hono";
import { UsersTable } from "../drizzle/schema";
import db from "../drizzle/db";
import { eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

const roleGuard = (allowedRoles: string[]) => {
    return async (c: Context, next: Next) => {
        const authHeader = c.req.header("Authorization");
        if (!authHeader) {
            return c.json({ error: "No authorization header" }, 401);
        }

        // Get token from header
        const token = authHeader.split(" ")[1];

        try {
            // Verify token
            const decoded = verify(token, JWT_SECRET) as { userId: number; role: string };

            // Verify role using the correct schema
            const user = await db.query.UsersTable.findFirst({
                where: (users) => eq(users.userid, decoded.userId),
                columns: {
                    role: true
                }
            });

            if (!user || !allowedRoles.includes(user.role)) {
                return c.json({ error: "Unauthorized" }, 403);
            }

            await next();
        } catch (error) {
            return c.json({ error: "Invalid token" }, 401);
        }
    };
};

// Update guards with new role permissions
export const adminGuard = roleGuard(['admin']);
export const managerGuard = roleGuard(['admin', 'manager']);
export const cashierInGuard = roleGuard(['cashier in']); // Modified to only allow cashier in
export const cashierOutGuard = roleGuard(['cashier out']); // Modified to only allow cashier out