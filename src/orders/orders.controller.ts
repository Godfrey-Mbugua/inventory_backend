import { Context } from 'hono';
import { createOrderService, getOrdersService, getOrderByIdService, updateOrderService, deleteOrderService } from './orders.services'
import { orderSchema } from '../validators';

// Create a new order
export const createOrderController = async (c: Context) => {
    try {
        const result = orderSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await createOrderService(result.data);
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating order:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all orders
export const getOrdersController = async (c: Context) => {
    try {
        const orders = await getOrdersService();
        return c.json(orders, 200);
    } catch (error: any) {
        console.error("Error getting orders:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Get an order by ID
export const getOrderByIdController = async (c: Context) => {
    try {
        const orderId = parseInt(c.req.param('id'), 10);
        if (isNaN(orderId)) return c.text("Invalid ID", 400);

        const order = await getOrderByIdService(orderId);
        if (!order) {
            return c.text("Order not found", 404);
        }
        return c.json(order, 200);
    } catch (error: any) {
        console.error("Error getting order:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update an order by ID
export const updateOrderController = async (c: Context) => {
    try {
        const orderId = parseInt(c.req.param('id'), 10);
        if (isNaN(orderId)) return c.text("Invalid ID", 400);

        const result = orderSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await updateOrderService(orderId, result.data);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating order:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete an order by ID
export const deleteOrderController = async (c: Context) => {
    try {
        const orderId = parseInt(c.req.param('id'), 10);
        if (isNaN(orderId)) return c.text("Invalid ID", 400);

        const message = await deleteOrderService(orderId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting order:", error);
        return c.json({ error: error.message }, 400);
    }
};