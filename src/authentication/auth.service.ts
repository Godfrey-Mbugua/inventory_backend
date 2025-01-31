import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import db from '../drizzle/db';
import { UsersTable, TSUser } from '../drizzle/schema';
import { loginUserSchema } from '../validators';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Register a new user
export const registerUserService = async (username: string, email: string, password: string, role: 'admin' | 'user'): Promise<string> => {
    const hashedPassword = await hash(password, 10);
    await db.insert(UsersTable).values({
        username,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return "User registered successfully";
};

// Login a user
export const loginUserService = async (email: string, password: string): Promise<string> => {
    const user = await db.query.UsersTable.findFirst({
        where: (users) => eq(users.email, email)
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = sign({ userId: user.userid, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};

// Verify a token
export const verifyTokenService = (token: string): TSUser | null => {
    try {
        const decoded = verify(token, JWT_SECRET) as TSUser;
        return decoded;
    } catch (error) {
        return null;
    }
};