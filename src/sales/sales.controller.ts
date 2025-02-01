import { Context } from 'hono';
import { createSaleService, getSalesService, getSaleByIdService, updateSaleService, deleteSaleService } from './sales.services'
import { saleSchema } from '../validators';

// Create a new sale
export const createSaleController = async (c: Context) => {
    try {
        const result = saleSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await createSaleService(result.data);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating sale:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all sales
export const getSalesController = async (c: Context) => {
    try {
        const sales = await getSalesService();
        return c.json(sales, 200);
    } catch (error: any) {
        console.error("Error getting sales:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Get a sale by ID
export const getSaleByIdController = async (c: Context) => {
    try {
        const saleId = parseInt(c.req.param('id'), 10);
        if (isNaN(saleId)) return c.text("Invalid ID", 400);

        const sale = await getSaleByIdService(saleId);
        if (!sale) {
            return c.text("Sale not found", 404);
        }
        return c.json(sale, 200);
    } catch (error: any) {
        console.error("Error getting sale:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update a sale by ID
export const updateSaleController = async (c: Context) => {
    try {
        const saleId = parseInt(c.req.param('id'), 10);
        if (isNaN(saleId)) return c.text("Invalid ID", 400);

        const result = saleSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await updateSaleService(saleId, result.data);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating sale:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete a sale by ID
export const deleteSaleController = async (c: Context) => {
    try {
        const saleId = parseInt(c.req.param('id'), 10);
        if (isNaN(saleId)) return c.text("Invalid ID", 400);

        const message = await deleteSaleService(saleId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting sale:", error);
        return c.json({ error: error.message }, 400);
    }
};