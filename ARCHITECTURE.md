# AI Exercise Generator - Architecture Documentation

## Project Structure

### Frontend-Backend Separation

The application follows a clear separation of concerns with distinct frontend and backend components:

- **Frontend**: React-based single-page application handling user interface and client-side logic
- **Backend**: Node.js/Express API server managing OpenAI integration and data processing
- **Communication**: RESTful API calls using Axios for HTTP communication

This separation enables independent development, deployment, and scaling of each component.

### Component-Based React Architecture

The frontend implements a modular component structure:

```
src/
├── components/          # Reusable UI components
│   ├── TopicInput.js    # Topic and configuration input
│   ├── ExerciseDisplay.js # Exercise selection interface
│   ├── QuizInterface.js  # Interactive quiz component
│   ├── ResultsDisplay.js # Results and statistics
│   ├── ProgressIndicator.js # Progress tracking
│   └── ErrorBoundary.js   # Error handling wrapper
├── utils/              # Utility functions
│   ├── api.js          # API communication layer
│   ├── storage.js      # Local storage management
│   └── errorHandler.js # Error management
└── App.js              # Main application component
```

### Backend Architecture

The backend follows Model-View-Controller architecture:

```
backend/
├── routes/             # Route definitions (View layer)
│   └── exercises.js    # API endpoint definitions
├── controllers/        # Business logic (Controller layer)
│   └── exerciseController.js # Exercise generation logic
├── utils/             # Service layer (Model layer)
│   └── openaiHelper.js # OpenAI API integration
└── server.js          # Application entry point
```

**Route → Controller → Utility Flow:**
1. Routes define API endpoints and handle HTTP requests
2. Controllers process business logic and coordinate data flow
3. Utilities handle external API calls and data transformation

## Key Technical Decisions

### Lazy OpenAI Client Initialization

**Decision**: Initialize OpenAI client within the function rather than globally.

**Rationale**: 
- Prevents API key exposure during application startup
- Enables better error handling for missing credentials
- Supports dynamic configuration changes
- Reduces memory footprint when OpenAI features are unused

**Implementation**:
```javascript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```


### Character Tone Feature Implementation

**Decision**: Tone selection affects OpenAI prompt generation.

**Rationale**:
- Improves user experience with personalized content
- Leverages OpenAI's capability to adapt writing style
- Provides educational variety for different learning preferences
- Maintains consistent tone across all generated content

**Implementation**:
- Tone mapping in OpenAI helper functions
- Dynamic prompt modification based on selected tone
- Consistent tone application across all difficulty levels

## Data Flow

### Primary User Journey

1. **User Input**: Topic and tone selection
2. **API Request**: Frontend sends configuration to backend
3. **OpenAI Processing**: Backend generates exercises for three difficulty levels
4. **Response Processing**: Structured data returned to frontend
5. **UI Display**: Exercises presented with difficulty selection
6. **Quiz Interaction**: User selects difficulty and takes quiz
7. **Results Processing**: Score calculation and statistics
8. **Data Persistence**: Results saved to localStorage

### Background Image Integration

1. **Topic Analysis**: Extract keywords from user topic
2. **Tone Mapping**: Convert tone to visual style keywords
3. **Search Query**: Combine topic and tone for Unsplash API
4. **Image Fetching**: Retrieve appropriate background image
5. **Caching**: Store image data for 24-hour reuse
6. **UI Application**: Apply background with overlay for readability

### Error Handling and Fallback Strategies

1. **Network Errors**: Automatic retry with exponential backoff
2. **API Errors**: User-friendly error messages with recovery suggestions
3. **Validation Errors**: Input validation with helpful feedback
4. **Timeout Errors**: Graceful handling with retry options
5. **Component Errors**: Error boundary catches React errors
6. **Fallback Content**: Default backgrounds when image loading fails

## Performance Considerations

### Optimization Strategies

- **Lazy Loading**: Components load only when needed
- **Image Caching**: Background images cached for 24 hours
- **Local Storage**: Efficient data persistence without server calls
- **Retry Logic**: Prevents unnecessary API calls on temporary failures
- **Error Boundaries**: Isolate component failures
