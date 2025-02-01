import { Hono } from 'hono';
import { createSupplierController, getSuppliersController, getSupplierByIdController, updateSupplierController, deleteSupplierController } from './suppliers.controller';
import { zValidator } from '@hono/zod-validator';
import { supplierSchema } from '../validators';

export const suppliersRouter = new Hono();

// Create a new supplier
suppliersRouter.post('/suppliers', 
    zValidator('json', supplierSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createSupplierController
);

// Get all suppliers
suppliersRouter.get('/suppliers', getSuppliersController);

// Get a supplier by ID
suppliersRouter.get('/suppliers/:id', getSupplierByIdController);

// Update a supplier by ID
suppliersRouter.put('/suppliers/:id', 
    zValidator('json', supplierSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    updateSupplierController
);

// Delete a supplier by ID
suppliersRouter.delete('/suppliers/:id', deleteSupplierController);