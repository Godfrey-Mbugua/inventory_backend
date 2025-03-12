import { Context } from 'hono';
import { createUserService, getUsersService, getUserByIdService, updateUserService, deleteUserService } from './user.service';

// Create a new user
export const createUserController = async (c: Context) => {
    try {
        const user = await c.req.json();
        const message = await createUserService(user);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating user:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all users
export const getUsersController = async (c: Context) => {
    try {
        const users = await getUsersService();
        return c.json(users, 200);
    } catch (error: any) {
        console.error("Error getting users:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get a user by ID
export const getUserByIdController = async (c: Context) => {
    try {
        const userId = parseInt(c.req.param('id'));
        const user = await getUserByIdService(userId);
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json(user, 200);
    } catch (error: any) {
        console.error("Error getting user by ID:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Update a user by ID
export const updateUserController = async (c: Context) => {
    try {
        const userId = parseInt(c.req.param('id'));
        const updatedUser = await c.req.json();
        const message = await updateUserService(userId, updatedUser);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating user:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete a user by ID
export const deleteUserController = async (c: Context) => {
    try {
        const userId = parseInt(c.req.param('id'));
        const message = await deleteUserService(userId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return c.json({ error: error.message }, 400);
    }
};