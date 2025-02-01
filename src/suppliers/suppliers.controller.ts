import { Context } from 'hono';
import { createSupplierService, getSuppliersService, getSupplierByIdService, updateSupplierService, deleteSupplierService } from './suppliers.services.js'
import { supplierSchema } from '../validators';

// Create a new supplier
export const createSupplierController = async (c: Context) => {
    try {
        const result = supplierSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await createSupplierService(result.data);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating supplier:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all suppliers
export const getSuppliersController = async (c: Context) => {
    try {
        const suppliers = await getSuppliersService();
        return c.json(suppliers, 200);
    } catch (error: any) {
        console.error("Error getting suppliers:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Get a supplier by ID
export const getSupplierByIdController = async (c: Context) => {
    try {
        const supplierId = parseInt(c.req.param('id'), 10);
        if (isNaN(supplierId)) return c.text("Invalid ID", 400);

        const supplier = await getSupplierByIdService(supplierId);
        if (!supplier) {
            return c.text("Supplier not found", 404);
        }
        return c.json(supplier, 200);
    } catch (error: any) {
        console.error("Error getting supplier:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update a supplier by ID
export const updateSupplierController = async (c: Context) => {
    try {
        const supplierId = parseInt(c.req.param('id'), 10);
        if (isNaN(supplierId)) return c.text("Invalid ID", 400);

        const result = supplierSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await updateSupplierService(supplierId, result.data);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating supplier:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete a supplier by ID
export const deleteSupplierController = async (c: Context) => {
    try {
        const supplierId = parseInt(c.req.param('id'), 10);
        if (isNaN(supplierId)) return c.text("Invalid ID", 400);

        const message = await deleteSupplierService(supplierId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting supplier:", error);
        return c.json({ error: error.message }, 400);
    }
};