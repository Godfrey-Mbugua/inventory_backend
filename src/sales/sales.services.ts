import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TISale, TSSale, SalesTable } from "../drizzle/schema";

// Create a new sale
export const createSaleService = async (sale: TISale): Promise<string> => {
    await db.insert(SalesTable).values(sale);
    return "Sale created successfully";
};

// Get all sales
export const getSalesService = async (): Promise<TSSale[]> => {
    return await db.query.SalesTable.findMany();
};

// Get a sale by ID
export const getSaleByIdService = async (saleId: number): Promise<TSSale | null> => {
    const sale = await db.query.SalesTable.findFirst({
        where: (sales) => eq(sales.saleid, saleId)
    });
    return sale || null; // Convert undefined to null
};

// Update a sale by ID
export const updateSaleService = async (saleId: number, updatedSale: Partial<TISale>): Promise<string> => {
    const result = await db.update(SalesTable)
        .set(updatedSale)
        .where(eq(SalesTable.saleid, saleId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Sale not found");
    }

    return "Sale updated successfully";
};

// Delete a sale by ID
export const deleteSaleService = async (saleId: number): Promise<string> => {
    const sale = await db.query.SalesTable.findFirst({
        where: (sales) => eq(sales.saleid, saleId)
    });

    if (!sale) {
        throw new Error("Sale not found");
    }

    await db.delete(SalesTable)
        .where(eq(SalesTable.saleid, saleId))
        .execute();

    return "Sale deleted successfully";
};