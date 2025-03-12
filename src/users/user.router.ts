import { Hono } from 'hono';
import { createUserController, getUsersController, getUserByIdController, updateUserController, deleteUserController } from './user.controller';
import { adminGuard, managerGuard } from '../middleware/auth.middleware';

export const userRouter = new Hono();

userRouter.post('/users', adminGuard, createUserController);
userRouter.get('/users', managerGuard, getUsersController);
userRouter.get('/users/:id', managerGuard, getUserByIdController);
userRouter.put('/users/:id', adminGuard, updateUserController);
userRouter.delete('/users/:id', adminGuard, deleteUserController);