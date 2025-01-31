import { Context } from 'hono';
import { createInventoryService, getInventoriesService, getInventoryByIdService, updateInventoryService, deleteInventoryService } from './inventory.service';
import { inventorySchema } from '../validators';

// Create a new inventory record
export const createInventoryController = async (c: Context) => {
    try {
        const result = inventorySchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await createInventoryService(result.data);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating inventory record:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all inventory records
export const getInventoriesController = async (c: Context) => {
    try {
        const inventories = await getInventoriesService();
        return c.json(inventories, 200);
    } catch (error: any) {
        console.error("Error getting inventory records:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Get an inventory record by ID
export const getInventoryByIdController = async (c: Context) => {
    try {
        const inventoryId = parseInt(c.req.param('id'), 10);
        if (isNaN(inventoryId)) return c.text("Invalid ID", 400);

        const inventory = await getInventoryByIdService(inventoryId);
        if (!inventory) {
            return c.text("Inventory record not found", 404);
        }
        return c.json(inventory, 200);
    } catch (error: any) {
        console.error("Error getting inventory record:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update an inventory record by ID
export const updateInventoryController = async (c: Context) => {
    try {
        const inventoryId = parseInt(c.req.param('id'), 10);
        if (isNaN(inventoryId)) return c.text("Invalid ID", 400);

        const result = inventorySchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await updateInventoryService(inventoryId, result.data);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating inventory record:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete an inventory record by ID
export const deleteInventoryController = async (c: Context) => {
    try {
        const inventoryId = parseInt(c.req.param('id'), 10);
        if (isNaN(inventoryId)) return c.text("Invalid ID", 400);

        const message = await deleteInventoryService(inventoryId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting inventory record:", error);
        return c.json({ error: error.message }, 400);
    }
};