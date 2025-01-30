import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIService, TSService, ServicesTable } from "../drizzle/schema";


// Create  service
export const createServiceService = async (service: TIService): Promise<string> => {
  await db.insert(ServicesTable).values(service);
  return "Service created successfully";
};

// delete service
export const deleteServiceService = async (id: number): Promise<string> => {
    await db.delete(ServicesTable).where(eq(ServicesTable.serviceid, id));
    return "Service deleted successfully";
  };

// get all services
export const getServicesService = async (): Promise<TSService[]> => {
    return await db.query.ServicesTable.findMany();
  };
  
  
  