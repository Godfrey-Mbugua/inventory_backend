import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TISupplier, TSSupplier, SuppliersTable } from "../drizzle/schema";

// Create a new supplier
export const createSupplierService = async (supplier: TISupplier): Promise<string> => {
    await db.insert(SuppliersTable).values(supplier);
    return "Supplier created successfully";
};

// Get all suppliers
export const getSuppliersService = async (): Promise<TSSupplier[]> => {
    return await db.query.SuppliersTable.findMany();
};

// Get a supplier by ID
export const getSupplierByIdService = async (supplierId: number): Promise<TSSupplier | null> => {
    const supplier = await db.query.SuppliersTable.findFirst({
        where: (suppliers) => eq(suppliers.supplierid, supplierId)
    });
    return supplier || null; // Convert undefined to null
};

// Update a supplier by ID
export const updateSupplierService = async (supplierId: number, updatedSupplier: Partial<TISupplier>): Promise<string> => {
    const result = await db.update(SuppliersTable)
        .set(updatedSupplier)
        .where(eq(SuppliersTable.supplierid, supplierId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Supplier not found");
    }

    return "Supplier updated successfully";
};

// Delete a supplier by ID
export const deleteSupplierService = async (supplierId: number): Promise<string> => {
    const supplier = await db.query.SuppliersTable.findFirst({
        where: (suppliers) => eq(suppliers.supplierid, supplierId)
    });

    if (!supplier) {
        throw new Error("Supplier not found");
    }

    await db.delete(SuppliersTable)
        .where(eq(SuppliersTable.supplierid, supplierId))
        .execute();

    return "Supplier deleted successfully";
};