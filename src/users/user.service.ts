import { PgColumn } from 'drizzle-orm/pg-core';
import db from '../drizzle/db';
import { UsersTable } from '../drizzle/schema';
import { TIUser, TSUser,  } from "../drizzle/schema";
import { eq as drizzleEq } from 'drizzle-orm/expressions';

// Create a new user
export const createUserService = async (user: TIUser): Promise<string> => {
    await db.insert(UsersTable).values(user);
    return "User created successfully";
};

// Get all users
export const getUsersService = async (): Promise<TSUser[]> => {
    return await db.query.UsersTable.findMany();
};

// Get a user by ID
export const getUserByIdService = async (userId: number): Promise<TSUser | null> => {
    const user = await db.query.UsersTable.findFirst({
        where: (users) => eq(users.userid, userId)
    });
    return user ?? null;
};

// Update a user by ID
export const updateUserService = async (userId: number, updatedUser: Partial<TIUser>): Promise<string> => {
    await db.update(UsersTable).set(updatedUser).where(eq(UsersTable.userid, userId));
    return "User updated successfully";
};

// Delete a user by ID
export const deleteUserService = async (userId: number): Promise<string> => {
    await db.delete(UsersTable).where(eq(UsersTable.userid, userId));
    return "User deleted successfully";
};

function eq(userid: PgColumn<{ name: "userid"; tableName: "users"; dataType: "number"; columnType: "PgSerial"; data: number; driverParam: number; notNull: true; hasDefault: true; enumValues: undefined; baseColumn: never; }, {}, {}>, userId: number): import("drizzle-orm").SQL<unknown> | undefined {
    return drizzleEq(userid, userId);
}
