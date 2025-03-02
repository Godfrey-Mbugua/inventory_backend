import { Context } from 'hono';
import { createPredictionService, getPredictionsService, getPredictionByIdService, updatePredictionService, deletePredictionService } from './predictions.services'
import { predictionSchema } from '../validators';




//createpredictions
export const createPredictionController = async (c: Context) => {
    try {
        const result = predictionSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }
        const message = await createPredictionService({ ...result.data, frequency: 1 });
        return c.json({ message }, 201);
    } catch (error: any) {
        console.error("Error creating prediction:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Get all predictions
export const getPredictionsController = async (c: Context) => {
    try {
        const predictions = await getPredictionsService();
        return c.json(predictions, 200);
    } catch (error: any) {
        console.error("Error getting predictions:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Get a prediction by ID
export const getPredictionByIdController = async (c: Context) => {
    try {
        const predictionId = parseInt(c.req.param('id'), 10);
        if (isNaN(predictionId)) return c.text("Invalid ID", 400);

        const prediction = await getPredictionByIdService(predictionId);
        if (!prediction) {
            return c.text("Prediction not found", 404);
        }
        return c.json(prediction, 200);
    } catch (error: any) {
        console.error("Error getting prediction:", error);
        return c.json({ error: error.message }, 500);
    }
};

// Update a prediction by ID
export const updatePredictionController = async (c: Context) => {
    try {
        const predictionId = parseInt(c.req.param('id'), 10);
        if (isNaN(predictionId)) return c.text("Invalid ID", 400);

        const result = predictionSchema.safeParse(await c.req.json());
        if (!result.success) {
            return c.json(result.error, 400);
        }

        const message = await updatePredictionService(predictionId, result.data);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error updating prediction:", error);
        return c.json({ error: error.message }, 400);
    }
};

// Delete a prediction by ID
export const deletePredictionController = async (c: Context) => {
    try {
        const predictionId = parseInt(c.req.param('id'), 10);
        if (isNaN(predictionId)) return c.text("Invalid ID", 400);

        const message = await deletePredictionService(predictionId);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.error("Error deleting prediction:", error);
        return c.json({ error: error.message }, 400);
    }
};