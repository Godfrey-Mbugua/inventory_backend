import { Hono } from 'hono';
import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController, deleteOrderController } from './orders.controller';
import { zValidator } from '@hono/zod-validator';
import { orderSchema } from '../validators';

export const ordersRouter = new Hono();

// Create a new order
ordersRouter.post('/orders', 
    zValidator('json', orderSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createOrderController
);

// Get all orders
ordersRouter.get('/orders', getOrdersController);

// Get an order by ID
ordersRouter.get('/orders/:id', getOrderByIdController);

// Update an order by ID
ordersRouter.put('/orders/:id', 
    zValidator('json', orderSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    updateOrderController
);

// Delete an order by ID
ordersRouter.delete('/orders/:id', deleteOrderController);