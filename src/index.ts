import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import "dotenv/config";
import { logger } from 'hono/logger';
import { csrf } from 'hono/csrf';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { HTTPException } from 'hono/http-exception';
import { rateLimiter } from "hono-rate-limiter";
import { jwt } from 'hono/jwt';
import { readFile } from 'fs/promises';
import { client } from './drizzle/db';  // Import the client

import { userRouter } from './users/user.router';
import { authRouter } from './authentication/auth.router';
import { productRouter } from './products/products.router';
import { inventoryRouter } from './inventory/inventory.router'; // Import the inventory router
import { ordersRouter } from './orders/orders.router'; // Import the orders router
import { salesRouter } from './sales/sales.router'; // Import the sales router
import { suppliersRouter } from './suppliers/suppliers.router'; // Import the suppliers router
import { predictionsRouter } from './predictions/predictions.router'; // Import the predictions router

const app = new Hono();

// change on the middle ware

//CORS middleware
// Add CORS middleware
app.use('/*', cors({
  origin: ['*'], // Your frontend URL
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// rate limiter
const limiter = rateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 10, // Limit each IP to 10 requests per minute
  standardHeaders: "draft-6",
  keyGenerator: (c) => "<unique_key>",
});

//default routes
app.get('/', async (c) => {
    try {
        let html = await readFile('./index.html', 'utf-8');
        return c.html(html);
    } catch (err:any) {
        return c.text(err.message, 500);
    }
});

// middlewares
app.use(logger());
app.use(csrf());
app.use(trimTrailingSlash());
app.use(limiter);

// JWT Middleware for authentication
app.use('/api/*', jwt({
  secret: process.env.JWT_SECRET as string,
}));

// Routes
app.route("/", userRouter);        // User management
app.route("/authentication", authRouter);
//app.route("/", clientRouter);      // Posible clients
//app.route("/", serviceRouter);     // Offered services
app.route("/", productRouter);     // Products
app.route("/", inventoryRouter);   // Inventory
app.route("/", ordersRouter);      // Orders
app.route("/", salesRouter);       // Sales
app.route("/", suppliersRouter);   // Suppliers
app.route("/", predictionsRouter); // Predictions

// Default route for unmatched paths
app.all('*', (c) => {
  return c.text('Page not found', 404);
});

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await client.end();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Error handling for uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await client.end();
    process.exit(1);
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

if (isNaN(PORT) || PORT < 0 || PORT >= 65536) {
    throw new RangeError(`Invalid port number: ${PORT}`);
}

try {
  serve({
    fetch: app.fetch,
    port: PORT
  });
  console.log(`Server is running on port ${PORT}`);
} catch (err: unknown) {
  console.error('Server error:', err);
  process.exit(1);
}