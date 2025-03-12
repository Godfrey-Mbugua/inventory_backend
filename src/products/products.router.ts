import { Hono } from 'hono';
import { createProductController, getProductsController, updateProductController, deleteProductController } from './products.controller';
import { cashierInGuard, cashierOutGuard } from '../middleware/auth.middleware';

export const productsRouter = new Hono();

productsRouter.post('/products', cashierInGuard, createProductController);
productsRouter.get('/products', cashierOutGuard, getProductsController);
productsRouter.put('/products/:id', cashierInGuard, updateProductController);
productsRouter.delete('/products/:id', cashierInGuard, deleteProductController);