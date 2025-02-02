import { Hono } from 'hono';
import { createPredictionController, getPredictionsController, getPredictionByIdController, updatePredictionController, deletePredictionController } from './predictions.controller';
import { zValidator } from '@hono/zod-validator';
import { predictionSchema } from '../validators';

export const predictionsRouter = new Hono();

// Create a new prediction
predictionsRouter.post('/predictions', 
    zValidator('json', predictionSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    createPredictionController
);

// Get all predictions
predictionsRouter.get('/predictions', getPredictionsController);

// Get a prediction by ID
predictionsRouter.get('/predictions/:id', getPredictionByIdController);

// Update a prediction by ID
predictionsRouter.put('/predictions/:id', 
    zValidator('json', predictionSchema, (result, c) => {
        if (!result.success) {
            return c.json(result.error, 400);
        }
    }), 
    updatePredictionController
);

// Delete a prediction by ID
predictionsRouter.delete('/predictions/:id', deletePredictionController);