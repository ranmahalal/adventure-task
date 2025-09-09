// Main App component with routing and state management
import React, { useState, useEffect } from 'react';
import { backgroundAPI } from './utils/api';
import { preferencesStorage } from './utils/storage';

// Import components
import TopicInput from './components/TopicInput';
import ExerciseDisplay from './components/ExerciseDisplay';
import QuizInterface from './components/QuizInterface';
import ResultsDisplay from './components/ResultsDisplay';
import ErrorBoundary from './components/ErrorBoundary';

// Application state constants
const APP_STATES = {
  TOPIC_INPUT: 'topic_input',
  EXERCISE_DISPLAY: 'exercise_display',
  QUIZ_INTERFACE: 'quiz_interface',
  RESULTS_DISPLAY: 'results_display'
};

// Main App component
const AppContent = () => {
  // Application state management
  const [currentState, setCurrentState] = useState(APP_STATES.TOPIC_INPUT);
  const [exercises, setExercises] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [topic, setTopic] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isLoadingBackground, setIsLoadingBackground] = useState(false);
  const [error, setError] = useState('');

  // Load user preferences on component mount
  useEffect(() => {
    // Preferences loading can be added here if needed
  }, []);

  // Handle exercises generation
  const handleExercisesGenerated = async (response) => {
    console.log('INFO: Exercises generated:', response);
    
    setExercises(response.exercises);
    setTopic(response.topic);
    setCurrentState(APP_STATES.EXERCISE_DISPLAY);
    setError('');

    // Load background image for the topic
    await loadBackgroundImage(response.topic, response.tone);
  };

  // Handle exercise generation error
  const handleExerciseError = (errorMessage) => {
    console.error('ERROR: Exercise generation error:', errorMessage);
    setError(errorMessage);
  };

  // Load background image
  const loadBackgroundImage = async (topicName, toneName) => {
    setIsLoadingBackground(true);
    
    try {
      const imageData = await backgroundAPI.getBackgroundImage(topicName, toneName);
      
      if (imageData && imageData.url) {
        console.log('DEBUG: Setting background image:', imageData.url);
        setBackgroundImage(imageData);
      } else {
        console.log('WARN: No valid image data received');
        setBackgroundImage(null);
      }
    } catch (error) {
      console.error('ERROR: Failed to load background image:', error);
      setBackgroundImage(null);
    } finally {
      setIsLoadingBackground(false);
      console.log('DEBUG: Background loading completed');
    }
  };

  // Handle quiz start
  const handleStartQuiz = (exercise) => {
    console.log('INFO: Starting quiz:', exercise.difficulty);
    setCurrentExercise(exercise);
    setCurrentState(APP_STATES.QUIZ_INTERFACE);
  };

  // Handle quiz completion
  const handleQuizComplete = (result) => {
    console.log('INFO: Quiz completed:', result);
    setQuizResult(result);
    setCurrentState(APP_STATES.RESULTS_DISPLAY);
  };

  // Handle restart quiz
  const handleRestartQuiz = () => {
    console.log('INFO: Restarting quiz');
    setCurrentState(APP_STATES.QUIZ_INTERFACE);
  };

  // Handle new topic
  const handleNewTopic = () => {
    console.log('INFO: Starting new topic');
    setCurrentState(APP_STATES.TOPIC_INPUT);
    setExercises(null);
    setCurrentExercise(null);
    setQuizResult(null);
    setTopic('');
    setError('');
    setBackgroundImage(null);
  };

  // Handle back to exercises
  const handleBackToExercises = () => {
    console.log('INFO: Back to exercises');
    setCurrentState(APP_STATES.EXERCISE_DISPLAY);
  };

  // Handle regenerate exercises
  const handleRegenerateExercises = async () => {
    console.log('INFO: Regenerating exercises');
    setCurrentState(APP_STATES.TOPIC_INPUT);
    setExercises(null);
    setError('');
  };

  // Handle back to topic input
  const handleBackToTopicInput = () => {
    console.log('INFO: Back to topic input');
    setCurrentState(APP_STATES.TOPIC_INPUT);
    setExercises(null);
    setError('');
  };

  // Get background style
  const getBackgroundStyle = () => {
    
    if (backgroundImage && backgroundImage.url) {
      const style = {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
      console.log('DEBUG: Returning background style with image:', style);
      return style;
    }
    
    const defaultStyle = {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    console.log('DEBUG: Returning default background style:', defaultStyle);
    return defaultStyle;
  };

  // Render current screen based on state
  const renderCurrentScreen = () => {
    switch (currentState) {
      case APP_STATES.TOPIC_INPUT:
        return (
          <TopicInput
            onExercisesGenerated={handleExercisesGenerated}
            onError={handleExerciseError}
          />
        );
      
      case APP_STATES.EXERCISE_DISPLAY:
        return (
          <ExerciseDisplay
            exercises={exercises}
            topic={topic}
            onStartQuiz={handleStartQuiz}
            onBack={handleBackToTopicInput}
            onRegenerate={handleRegenerateExercises}
          />
        );
      
      case APP_STATES.QUIZ_INTERFACE:
        return (
          <QuizInterface
            exercise={currentExercise}
            topic={topic}
            onComplete={handleQuizComplete}
            onBack={handleBackToExercises}
          />
        );
      
      case APP_STATES.RESULTS_DISPLAY:
        return (
          <ResultsDisplay
            result={quizResult}
            topic={topic}
            onRestart={handleRestartQuiz}
            onNewTopic={handleNewTopic}
            onBack={handleBackToExercises}
          />
        );
      
      default:
        return (
          <TopicInput
            onExercisesGenerated={handleExercisesGenerated}
            onError={handleExerciseError}
          />
        );
    }
  };

  return (
    <div className="min-h-screen transition-all duration-500" style={getBackgroundStyle()}>
      {/* Background Loading Indicator */}
      {isLoadingBackground && (
        <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-gray-600">Loading background...</span>
          </div>
        </div>
      )}

      {/* Background Attribution */}
      {backgroundImage && (
        <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          Photo by{' '}
          <a 
            href={backgroundImage.photographerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200"
          >
            {backgroundImage.photographer}
          </a>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md max-w-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {renderCurrentScreen()}
      </div>
    </div>
  );
};

// App component with Error Boundary
const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;