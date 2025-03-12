import { Hono } from 'hono';
import { createOrderController, getOrdersController, getOrderByIdController, updateOrderController, deleteOrderController } from './orders.controller';
import { managerGuard, cashierInGuard } from '../middleware/auth.middleware';

export const ordersRouter = new Hono();

ordersRouter.post('/orders', managerGuard, createOrderController);
ordersRouter.get('/orders', cashierInGuard, getOrdersController);
ordersRouter.get('/orders/:id', cashierInGuard, getOrderByIdController);
ordersRouter.put('/orders/:id', cashierInGuard, updateOrderController);
ordersRouter.delete('/orders/:id', cashierInGuard, deleteOrderController);