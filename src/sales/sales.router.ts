import { Hono } from 'hono';
import { createSaleController, getSalesController, getSaleByIdController, updateSaleController, deleteSaleController } from './sales.controller';
import { zValidator } from '@hono/zod-validator';
import { saleSchema } from '../validators';

export const salesRouter = new Hono();

// Create a new sale
salesRouter.post('/sales', 
    zValidator('json', saleSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createSaleController
);

// Get all sales
salesRouter.get('/sales', getSalesController);

// Get a sale by ID
salesRouter.get('/sales/:id', getSaleByIdController);

// Update a sale by ID
salesRouter.put('/sales/:id', 
    zValidator('json', saleSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    updateSaleController
);

// Delete a sale by ID
salesRouter.delete('/sales/:id', deleteSaleController);