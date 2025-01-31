import { Hono } from "hono";
import { createUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController } from "./user.controller";
import { zValidator } from "@hono/zod-validator";
import { userSchema } from "../validators";
import { adminRoleAuth } from "../middleware/bearAuth";

export const userRouter = new Hono();

// Get all users
userRouter.get("/users", getUsersController);

// Get a single user by ID
userRouter.get("/users/:id", getUserByIdController);

// Create a new user (only admins)
userRouter.post("/users", 
    adminRoleAuth, // Middleware to check if the user is an admin
    zValidator('json', userSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createUserController
);

// Update a user by ID
userRouter.put("/users/:id", updateUserController);

// Delete a user by ID (only admins)
userRouter.delete("/users/:id", 
    adminRoleAuth, // Middleware to check if the user is an admin
    deleteUserController
);


