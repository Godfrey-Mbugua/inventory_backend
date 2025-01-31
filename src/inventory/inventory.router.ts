import { Hono } from 'hono';
import { createInventoryController, getInventoriesController, getInventoryByIdController, updateInventoryController, deleteInventoryController } from './inventory.controller';
import { zValidator } from '@hono/zod-validator';
import { inventorySchema } from '../validators';

export const inventoryRouter = new Hono();

// Create a new inventory record
inventoryRouter.post('/inventory', 
    zValidator('json', inventorySchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createInventoryController
);

// Get all inventory records
inventoryRouter.get('/inventory', getInventoriesController);

// Get an inventory record by ID
inventoryRouter.get('/inventory/:id', getInventoryByIdController);

// Update an inventory record by ID
inventoryRouter.put('/inventory/:id', 
    zValidator('json', inventorySchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    updateInventoryController
);

// Delete an inventory record by ID
inventoryRouter.delete('/inventory/:id', deleteInventoryController);