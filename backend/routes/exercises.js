// Import express and create router
import express from 'express';
import { generateExercises } from '../controllers/exerciseController.js';
const router = express.Router();

// POST /generate - Generate exercises for a given topic
router.post('/generate', (req, res) => {
  console.log('POST /api/exercises/generate route hit');
  console.log('Request body:', req.body);
  
  // Basic validation: check if topic exists in request body
  if (!req.body.topic) {
    console.log('Validation failed: topic is missing');
    return res.status(400).json({
      success: false,
      message: 'Topic is required in request body'
    });
  }
  
  // Call the controller function
  generateExercises(req, res);
});

// Export the router
export default router;
