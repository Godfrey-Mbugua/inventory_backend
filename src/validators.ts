import { z } from 'zod';

// Users schema
export const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "user"]).default("user"),
});

// Auth schemas
export const loginUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUserSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin","manager","cashier in","cashier out", "user"]).default("user"),
});

// Products schema
export const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(3, "Description must be at least 3 characters").max(1000, "Description must be less than 1000 characters"),
    price: z.number().positive("Price must be a positive number"),
    quantityInStock: z.number().int().nonnegative("Quantity in stock must be a non-negative integer"),
});

// Inventory schema
export const inventorySchema = z.object({
    productid: z.number().int().positive("Product ID must be a positive integer"),
    quantityAvailable: z.number().int().nonnegative("Quantity available must be a non-negative integer"),
    reorderLevel: z.number().int().nonnegative("Reorder level must be a non-negative integer"),
});

// Orders schema
export const orderSchema = z.object({
    userid: z.number().int().positive("User ID must be a positive integer"),
    productid: z.number().int().positive("Product ID must be a positive integer"),
    quantityOrdered: z.number().int().positive("Quantity ordered must be a positive integer"),
    orderDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date())
});

// Suppliers schema
export const supplierSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    contactInfo: z.string().min(3, "Contact info must be at least 3 characters"),
});

// Sales schema
export const saleSchema = z.object({
    orderid: z.number().int().positive("Order ID must be a positive integer"),
    saleDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    totalAmount: z.number().positive("Total amount must be a positive number"),
});


// Predictions schema
export const predictionSchema = z.object({
    productid: z.number().int().positive("Product ID must be a positive integer"),
    predictedDemand: z.number().int().nonnegative("Predicted demand must be a non-negative integer"),
    predictionDate: z.preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
});