import { Hono } from 'hono';
import { createSaleController, getSalesController, getSaleByIdController, updateSaleController, deleteSaleController } from './sales.controller';
import { cashierInGuard, cashierOutGuard } from '../middleware/auth.middleware';

export const salesRouter = new Hono();

salesRouter.post('/sales', cashierInGuard, createSaleController);
salesRouter.get('/sales', cashierOutGuard, getSalesController);
salesRouter.get('/sales/:id', cashierOutGuard, getSaleByIdController);
salesRouter.put('/sales/:id', cashierOutGuard, updateSaleController);
salesRouter.delete('/sales/:id', cashierOutGuard, deleteSaleController);