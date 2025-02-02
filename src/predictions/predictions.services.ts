import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIPrediction, TSPrediction, PredictionsTable } from "../drizzle/schema";

// Create a new prediction
export const createPredictionService = async (prediction: TIPrediction): Promise<string> => {
    await db.insert(PredictionsTable).values(prediction);
    return "Prediction created successfully";
};

// Get all predictions
export const getPredictionsService = async (): Promise<TSPrediction[]> => {
    return await db.query.PredictionsTable.findMany();
};

// Get a prediction by ID
export const getPredictionByIdService = async (predictionId: number): Promise<TSPrediction | null> => {
    const prediction = await db.query.PredictionsTable.findFirst({
        where: (predictions) => eq(predictions.predictionid, predictionId)
    });
    return prediction || null; // Convert undefined to null
};

// Update a prediction by ID
export const updatePredictionService = async (predictionId: number, updatedPrediction: Partial<TIPrediction>): Promise<string> => {
    const result = await db.update(PredictionsTable)
        .set(updatedPrediction)
        .where(eq(PredictionsTable.predictionid, predictionId))
        .execute();

    if (result.rowCount === 0) {
        throw new Error("Prediction not found");
    }

    return "Prediction updated successfully";
};

// Delete a prediction by ID
export const deletePredictionService = async (predictionId: number): Promise<string> => {
    const prediction = await db.query.PredictionsTable.findFirst({
        where: (predictions) => eq(predictions.predictionid, predictionId)
    });

    if (!prediction) {
        throw new Error("Prediction not found");
    }

    await db.delete(PredictionsTable)
        .where(eq(PredictionsTable.predictionid, predictionId))
        .execute();

    return "Prediction deleted successfully";
};