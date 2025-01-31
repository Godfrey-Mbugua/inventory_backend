import { Context } from 'hono';
import { createUserService, getUsersService, getUserByIdService, updateUserService, deleteUserService } from './user.service';

// Create a new user
export const createUserController = async (c: Context) => {
    try {
        const user = await c.req.json();
        const currentUserRole = c.req.header('role'); // Assuming the role is passed in the header
        if (currentUserRole !== 'admin') {
            return c.json({ error: "Only admins can create new users" }, 403);
        }
        const message = await createUserService(user, currentUserRole);
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
        return c.json({ error: error.message }, 500);
    }
};

// Get a user by ID
export const getUserByIdController = async (c: Context) => {
    try {
        const userId = parseInt(c.req.param('id'), 10);
        if (isNaN(userId)) return c.text("Invalid ID", 400);

        const user = await getUserByIdService(userId);
        if (!user) {
            return c.text("User not found", 404);
        }
        return c.json(user, 200);
    } catch (error: any) {
        console.error("Error getting user:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update a user by ID
export const updateUserController = async (c: Context) => {
    try {
        const userId = parseInt(c.req.param('id'), 10);
        if (isNaN(userId)) return c.text("Invalid ID", 400);

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
        const userId = parseInt(c.req.param('id'), 10);
        if (isNaN(userId)) return c.text("Invalid ID", 400);

        const currentUserRole = c.req.header('role'); // Assuming the role is passed in the header
        if (currentUserRole !== 'admin') {
            return c.json({ error: "Only admins can delete users" }, 403);
        }
        const message = await deleteUserService(userId, currentUserRole);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return c.json({ error: error.message }, 400);
    }
};