import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIProduct, TSProduct, ProductsTable } from "../drizzle/schema";

// create product
export const createProductService = async (product: TIProduct): Promise<string> => {
    await db.insert(ProductsTable).values(product);
    return "Product created successfully";
};

//delete services
export const deleteProductService = async (id: number): Promise<string> => {
    await db.delete(ProductsTable).where(eq(ProductsTable.productid, id));
    return "Product deleted successfully";
};

// get all services
export const getProductsService = async (): Promise<TSProduct[]> => {
    const products = await db.select().from(ProductsTable);
    return products;
};
