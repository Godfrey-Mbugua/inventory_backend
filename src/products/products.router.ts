import { Hono } from 'hono';
import { createProductController, getProductsController, updateProductController, deleteProductController } from './products.controller';
import { cashierInGuard } from '../middleware/auth.middleware';

export const productsRouter = new Hono();

// All product operations now require cashier in role
productsRouter.post('/products', cashierInGuard, createProductController);
productsRouter.get('/products', cashierInGuard, getProductsController);
productsRouter.put('/products/:id', cashierInGuard, updateProductController);
productsRouter.delete('/products/:id', cashierInGuard, deleteProductController);