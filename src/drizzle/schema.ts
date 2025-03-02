import { pgTable, serial, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { One, Many, relations } from "drizzle-orm";

// Role Enum
export const roleEnum = pgEnum("role", ["admin","manager", "cashier in","cashier out"]);

// Users Table
export const UsersTable = pgTable('users', {
  userid: serial('userid').primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: roleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Auth Table
export const AuthTable = pgTable('auth', {
  authid: serial('authid').primaryKey(),
  userid: integer('user_id').references(() => UsersTable.userid, { onDelete: "cascade" }),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role'),
  createdAt: timestamp('created_at').defaultNow(),
});


// Products Table
export const ProductsTable = pgTable('products', {
  productid: serial('productid').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  quantityInStock: integer('quantity_in_stock').notNull(),
});

// Inventory Table
export const InventoryTable = pgTable('inventory', {
  inventoryid: serial('inventoryid').primaryKey(),
  productid: integer('productid').references(() => ProductsTable.productid),
  quantityAvailable: integer('quantity_available').notNull(),
  reorderLevel: integer('reorder_level').notNull(),
});

// Orders Table
export const OrdersTable = pgTable('orders', {
  orderid: serial('orderid').primaryKey(),
  userid: integer('userid').references(() => UsersTable.userid),
  productid: integer('productid').references(() => ProductsTable.productid),
  quantityOrdered: integer('quantity_ordered').notNull(),
  orderDate: timestamp('order_date').defaultNow(),
});

// Suppliers Table
export const SuppliersTable = pgTable('suppliers', {
  supplierid: serial('supplierid').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactInfo: varchar('contact_info', { length: 255 }).notNull(),
});

// Sales Table
export const SalesTable = pgTable('sales', {
  saleid: serial('saleid').primaryKey(),
  orderid: integer('orderid').references(() => OrdersTable.orderid),
  saleDate: timestamp('sale_date').defaultNow(),
  totalAmount: integer('total_amount').notNull(),
});

// Predictions Table
export const PredictionsTable = pgTable('predictions', {
  predictionid: serial('predictionid').primaryKey(),
  productid: integer('productid').references(() => ProductsTable.productid),
  predictedDemand: integer('predicted_demand').notNull(),
  predictionDate: timestamp('prediction_date').defaultNow(),
  frequency: integer('frequency').notNull(), // Add this column
});



// Relationships
export const UsersRelations = relations(UsersTable, ({ many }) => ({
  orders: many(OrdersTable),
}));

export const ProductsRelations = relations(ProductsTable, ({ many }) => ({
  inventory: many(InventoryTable),
  orders: many(OrdersTable),
  predictions: many(PredictionsTable),
}));

export const InventoryRelations = relations(InventoryTable, ({ one }) => ({
  product: one(ProductsTable),
}));

export const OrdersRelations = relations(OrdersTable, ({ one, many }) => ({
  user: one(UsersTable),
  product: one(ProductsTable),
  sales: many(SalesTable),
}));

export const SuppliersRelations = relations(SuppliersTable, ({ many }) => ({
  products: many(ProductsTable),
}));

export const SalesRelations = relations(SalesTable, ({ one }) => ({
  order: one(OrdersTable),
}));

export const PredictionsRelations = relations(PredictionsTable, ({ one }) => ({
  product: one(ProductsTable),
}));

// Types
export type TIUser = typeof UsersTable.$inferInsert;
export type TSUser = typeof UsersTable.$inferSelect;

export type TIProduct = typeof ProductsTable.$inferInsert;
export type TSProduct = typeof ProductsTable.$inferSelect;

export type TIInventory = typeof InventoryTable.$inferInsert;
export type TSInventory = typeof InventoryTable.$inferSelect;

export type TIOrder = typeof OrdersTable.$inferInsert;
export type TSOrder = typeof OrdersTable.$inferSelect;

export type TISupplier = typeof SuppliersTable.$inferInsert;
export type TSSupplier = typeof SuppliersTable.$inferSelect;

export type TISale = typeof SalesTable.$inferInsert;
export type TSSale = typeof SalesTable.$inferSelect;

export type TIPrediction = typeof PredictionsTable.$inferInsert;
export type TSPrediction = typeof PredictionsTable.$inferSelect;




