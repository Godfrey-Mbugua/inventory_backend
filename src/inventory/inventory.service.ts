import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIInventory, TSInventory, InventoryTable } from "../drizzle/schema";

// Create a new inventory record
export const createInventoryService = async (inventory: TIInventory): Promise<string> => {
    await db.insert(InventoryTable).values(inventory);
    return "Inventory record created successfully";
};

// Get all inventory records
export const getInventoriesService = async (): Promise<TSInventory[]> => {
    return await db.query.InventoryTable.findMany();
};

// Get an inventory record by ID
export const getInventoryByIdService = async (inventoryId: number): Promise<TSInventory | null> => {
    const inventory = await db.query.InventoryTable.findFirst({
        where: (inventory) => eq(inventory.inventoryid, inventoryId)
    });
    return inventory || null; // Convert undefined to null
};

// Update an inventory record by ID
export const updateInventoryService = async (inventoryId: number, updatedInventory: Partial<TIInventory>): Promise<string> => {
    const result = await db.update(InventoryTable)
        .set(updatedInventory)
        .where(eq(InventoryTable.inventoryid, inventoryId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Inventory record not found");
    }

    return "Inventory record updated successfully";
};

// Delete an inventory record by ID
export const deleteInventoryService = async (inventoryId: number): Promise<string> => {
    const inventory = await db.query.InventoryTable.findFirst({
        where: (inventory) => eq(inventory.inventoryid, inventoryId)
    });

    if (!inventory) {
        throw new Error("Inventory record not found");
    }

    await db.delete(InventoryTable)
        .where(eq(InventoryTable.inventoryid, inventoryId))
        .execute();

    return "Inventory record deleted successfully";
};