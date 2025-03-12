import { Hono } from 'hono';
import { createSupplierController, getSuppliersController, getSupplierByIdController, updateSupplierController, deleteSupplierController } from './suppliers.controller';
import { cashierInGuard } from '../middleware/auth.middleware';

export const suppliersRouter = new Hono();

suppliersRouter.post('/suppliers', cashierInGuard, createSupplierController);
suppliersRouter.get('/suppliers', cashierInGuard, getSuppliersController);
suppliersRouter.get('/suppliers/:id', cashierInGuard, getSupplierByIdController);
suppliersRouter.put('/suppliers/:id', cashierInGuard, updateSupplierController);
suppliersRouter.delete('/suppliers/:id', cashierInGuard, deleteSupplierController);