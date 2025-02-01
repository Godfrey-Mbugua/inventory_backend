import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIOrder, TSOrder, OrdersTable } from "../drizzle/schema";

// Create a new order
export const createOrderService = async (order: TIOrder): Promise<string> => {
    await db.insert(OrdersTable).values(order);
    return "Order created successfully";
};

// Get all orders
export const getOrdersService = async (): Promise<TSOrder[]> => {
    return await db.query.OrdersTable.findMany();
};

// Get an order by ID
export const getOrderByIdService = async (orderId: number): Promise<TSOrder | null> => {
    const order = await db.query.OrdersTable.findFirst({
        where: (orders) => eq(orders.orderid, orderId)
    });
    return order || null; // Convert undefined to null
};

// Update an order by ID
export const updateOrderService = async (orderId: number, updatedOrder: Partial<TIOrder>): Promise<string> => {
    const result = await db.update(OrdersTable)
        .set(updatedOrder)
        .where(eq(OrdersTable.orderid, orderId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Order not found");
    }

    return "Order updated successfully";
};

// Delete an order by ID
export const deleteOrderService = async (orderId: number): Promise<string> => {
    const order = await db.query.OrdersTable.findFirst({
        where: (orders) => eq(OrdersTable.orderid, orderId)
    });

    if (!order) {
        throw new Error("Order not found");
    }

    await db.delete(OrdersTable)
        .where(eq(OrdersTable.orderid, orderId))
        .execute();

    return "Order deleted successfully";
};