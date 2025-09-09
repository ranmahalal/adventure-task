// Exercise controller for handling exercise generation logic
import { generateExercisePrompt } from '../utils/openaiHelper.js';

export const generateExercises = async (req, res) => {
  console.log('INFO: generateExercises controller called');
  console.log('DEBUG: Request body:', req.body);
  
  try {
    // Extract topic and tone from request body (language hard-coded to English)
    const { topic, tone = 'professional' } = req.body;
    const language = 'en'; // Always English
    
    // Validate required fields
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required and cannot be empty'
      });
    }
    
    console.log(`INFO: Generating exercises for topic: ${topic}, language: ${language}, tone: ${tone}`);
    
    // Generate exercises for all three difficulty levels
    const difficulties = ['beginner', 'intermediate', 'expert'];
    const exercises = [];
    
    // Generate exercises for each difficulty level
    for (const difficulty of difficulties) {
      console.log(`INFO: Generating ${difficulty} exercises...`);
      
      try {
        const exerciseData = await generateExercisePrompt(topic, difficulty, tone);
        
        exercises.push({
          difficulty: difficulty,
          questions: exerciseData.questions
        });
        
        console.log(`INFO: Successfully generated ${difficulty} exercises`);
        
      } catch (openaiError) {
        console.error(`ERROR: Failed to generate ${difficulty} exercises:`, openaiError);
        
        // Return error response instead of fallback data
        return res.status(500).json({
          success: false,
          message: `Failed to generate ${difficulty} level exercises. Please check your OpenAI API key and try again.`,
          error: openaiError.message
        });
      }
    }
    
    // Prepare the final response
    const response = {
      success: true,
      topic: topic,
      language: language,
      tone: tone,
      exercises: exercises
    };
    
    console.log('INFO: Sending AI-generated exercises response');
    res.json(response);
    
  } catch (error) {
    console.error('ERROR: Error in generateExercises:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while generating exercises',
      error: error.message
    });
  }
};
