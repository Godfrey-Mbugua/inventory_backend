import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIProduct, TSProduct, ProductsTable } from "../drizzle/schema";

//create a new product
export const createProductService = async (product: TIProduct): Promise<string> => {
    await db.insert(ProductsTable).values(product);
    return "Product created successfully";
  };


//get all products
export const getProductsService = async (): Promise<TSProduct[]> => {
    return await db.query.ProductsTable.findMany();
  };

// Update a product by ID
export const updateProductService = async (productId: number, updatedProduct: Partial<TIProduct>): Promise<string> => {
    const result = await db.update(ProductsTable)
        .set(updatedProduct)
        .where(eq(ProductsTable.productid, productId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Product not found");
    }

    return "Product updated successfully";
};

// Delete a product by ID
export const deleteProductService = async (productId: number): Promise<string> => {
    const product = await db.query.ProductsTable.findFirst({
        where: eq(ProductsTable.productid, productId)
    });

    if (!product) {
        throw new Error("Product not found");
    }

    await db.delete(ProductsTable)
        .where(eq(ProductsTable.productid, productId))
        .execute();

    return "Product deleted successfully";
};