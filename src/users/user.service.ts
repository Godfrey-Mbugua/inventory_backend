import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUser, TSUser, UsersTable } from "../drizzle/schema";

// Create a new user
export const createUserService = async (user: TIUser, currentUserRole: string): Promise<string> => {
    if (currentUserRole !== 'admin') {
        throw new Error("Only admins can create new users");
    }
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
  return user || null; // Convert undefined to null
};
// Update a user by ID
export const updateUserService = async (userId: number, updatedUser: Partial<TIUser>): Promise<string> => {
    const result = await db.update(UsersTable)
        .set(updatedUser)
        .where(eq(UsersTable.userid, userId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("User not found");
    }

    return "User updated successfully";
};

// Delete a user by ID
export const deleteUserService = async (userId: number, currentUserRole: string): Promise<string> => {
    if (currentUserRole !== 'admin') {
        throw new Error("Only admins can delete users");
    }

    const user = await db.query.UsersTable.findFirst({
        where: (users) => eq(users.userid, userId)
    });

    if (!user) {
        throw new Error("User not found");
    }

    await db.delete(UsersTable)
        .where(eq(UsersTable.userid, userId))
        .execute();

    return "User deleted successfully";
};