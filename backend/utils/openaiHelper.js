// OpenAI helper for generating exercise questions
import OpenAI from 'openai';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff delays in ms

// Sleep function for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to strip markdown code blocks from OpenAI response
function stripMarkdownCodeBlocks(content) {
  if (!content || typeof content !== 'string') {
    return content;
  }
  
  
  // Remove ```json at the start (case insensitive)
  let cleaned = content.replace(/^```json\s*/i, '');
  
  // Remove ``` at the end (case insensitive)
  cleaned = cleaned.replace(/\s*```\s*$/i, '');
  
  // Also handle cases where there might be other markdown formatting
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```\s*$/i, '');
  
  // Trim any remaining whitespace
  cleaned = cleaned.trim();
  
  console.log(`DEBUG: Stripped markdown code blocks. Original length: ${content.length}, Cleaned length: ${cleaned.length}`);
  
  return cleaned;
}

// Generate exercise prompt for a specific topic, difficulty, and tone (language hard-coded to English)
export const generateExercisePrompt = async (topic, difficulty, tone = 'professional') => {
  const language = 'en'; // Always English
  console.log(`INFO: Generating ${difficulty} exercises for topic: ${topic} in ${language} with ${tone} tone`);
  
  // Create OpenAI client instance inside the function (lazy initialization)
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.');
  }

  // Retry logic with exponential backoff
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Create detailed prompt for generating MCQs with tone consideration
      const toneInstructions = getToneInstructions(tone);
      
      const prompt = `Generate 10 multiple-choice questions for the topic "${topic}" at ${difficulty} difficulty level. 
      
      Requirements:
      - Language: ${language}
      - Difficulty: ${difficulty}
      - Tone: ${tone} (${toneInstructions})
      - Each question must have exactly 4 choices (A, B, C, D)
      - Only one correct answer per question
      - Include detailed explanations for correct answers
      - Questions should be relevant and educational for ${difficulty} level
      - Maintain the ${tone} tone throughout all questions and explanations
      
      Return the response as a valid JSON object with this exact structure:
      {
        "questions": [
          {
            "question": "Question text here",
            "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
            "correctAnswer": "A",
            "explanation": "Detailed explanation here"
          }
        ]
      }
      
      IMPORTANT: Return ONLY the raw JSON object without any markdown formatting, code blocks, or additional text. Do not wrap the JSON in markdown code blocks or any other formatting.`;

      console.log(`DEBUG: Sending prompt to OpenAI for ${difficulty} level (attempt ${attempt + 1})`);
      
      // Call OpenAI chat completion API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert educational content creator. Generate high-quality multiple-choice questions with clear explanations. Maintain a ${tone} tone throughout all content.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log(`INFO: OpenAI response received for ${difficulty} level`);
      
      // Extract and parse the response
      const responseContent = completion.choices[0].message.content;
      
      // Strip markdown code blocks before parsing JSON
      const cleanedContent = stripMarkdownCodeBlocks(responseContent);
      
      // Try to parse JSON from the cleaned response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error(`ERROR: Failed to parse JSON from OpenAI response for ${difficulty}:`, parseError);
        console.error(`ERROR: Raw content that failed to parse:`, responseContent);
        console.error(`ERROR: Cleaned content that failed to parse:`, cleanedContent);
        throw new Error(`Invalid JSON response from OpenAI for ${difficulty} level`);
      }
      
      // Validate the response structure
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error(`Invalid response structure from OpenAI for ${difficulty} level`);
      }
      
      // Validate each question structure
      for (let i = 0; i < parsedResponse.questions.length; i++) {
        const question = parsedResponse.questions[i];
        if (!question.question || !question.choices || !question.correctAnswer || !question.explanation) {
          throw new Error(`Invalid question structure at index ${i} for ${difficulty} level`);
        }
        if (!Array.isArray(question.choices) || question.choices.length !== 4) {
          throw new Error(`Invalid choices array at index ${i} for ${difficulty} level`);
        }
      }
      
      console.log(`INFO: Successfully generated ${parsedResponse.questions.length} questions for ${difficulty} level`);
      return parsedResponse;
      
    } catch (error) {
      console.error(`ERROR: OpenAI API error for ${difficulty} level (attempt ${attempt + 1}):`, error);
      
      // Check if this is a retryable error
      const isRetryableError = error.code === 'rate_limit_exceeded' || 
                              error.code === 'server_error' || 
                              error.code === 'timeout' ||
                              error.message.includes('timeout') ||
                              error.message.includes('rate limit');
      
      if (attempt === MAX_RETRIES - 1 || !isRetryableError) {
        // Last attempt or non-retryable error
        throw new Error(`Failed to generate exercises for ${difficulty} level after ${attempt + 1} attempts: ${error.message}`);
      }
      
      // Wait before retrying
      console.log(`INFO: Retrying in ${RETRY_DELAYS[attempt]}ms...`);
      await sleep(RETRY_DELAYS[attempt]);
    }
  }
};

// Helper function to get tone-specific instructions
function getToneInstructions(tone) {
  const toneMap = {
    'professional': 'Use formal, academic language with clear explanations',
    'casual': 'Use friendly, conversational language that feels approachable',
    'humorous': 'Include light humor and witty explanations while maintaining educational value',
    'encouraging': 'Use supportive, motivating language that builds confidence',
    'technical': 'Use precise technical terminology and detailed explanations',
    'simple': 'Use basic vocabulary and straightforward explanations'
  };
  
  return toneMap[tone] || toneMap['professional'];
}
