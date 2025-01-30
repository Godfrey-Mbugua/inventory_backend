import { Context } from 'hono';
import { createProductService, getProductsService, updateProductService, deleteProductService } from './products.servise'

// Create a new product
export const createProductController = async (c: Context) => {
    try {
        const product = await c.req.json();
        const message = await createProductService(product);
        return c.json({ message }, 201);
    } catch (error) {
        console.error("Error creating product:", error);
        return c.json({ error: "Failed to create product" }, 500);
    }
};

// Get all products
export const getProductsController = async (c: Context) => {
    try {
        const products = await getProductsService();
        return c.json(products, 200);
    } catch (error) {
        console.error("Error getting products:", error);
        return c.json({ error: "Failed to get products" }, 500);
    }
};

// Update a product by ID
export const updateProductController = async (c: Context) => {
    try {
        const productId = parseInt(c.req.param('id'), 10);
        const updatedProduct = await c.req.json();
        const message = await updateProductService(productId, updatedProduct);
        return c.json({ message }, 200);
    } catch (error) {
        console.error("Error updating product:", error);
        return c.json({ error: "Failed to update product" }, 500);
    }
};

// Delete a product by ID
export const deleteProductController = async (c: Context) => {
    try {
        const productId = parseInt(c.req.param('id'), 10);
        const message = await deleteProductService(productId);
        return c.json({ message }, 200);
    } catch (error) {
        console.error("Error deleting product:", error);
        return c.json({ error: "Failed to delete product" }, 500);
    }
};