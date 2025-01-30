import { Hono } from "hono";
import { createProductController, getProductsController, updateProductController, deleteProductController } from "./products.controller";
import { zValidator } from "@hono/zod-validator";
import { productSchema } from "../validators";
import { adminRoleAuth } from "../middleware/bearAuth";

export const productRouter = new Hono();

// Create a new product
productRouter.post("/products", 
    zValidator('json', productSchema),
    createProductController
);

// Get all products
productRouter.get("/products", getProductsController);

// Update a product by ID
productRouter.put("/products/:id", 
    zValidator('json', productSchema),
    updateProductController
);

// Delete a product by ID
productRouter.delete("/products/:id", deleteProductController);