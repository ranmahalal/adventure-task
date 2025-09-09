// TopicInput component for entering topics and selecting options
import React, { useState } from 'react';
import { exerciseAPI } from '../utils/api';
import { handleError } from '../utils/errorHandler';

const TopicInput = ({ onExercisesGenerated = () => {}, onError = () => {} }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'encouraging', label: 'Encouraging' },
    { value: 'technical', label: 'Technical' },
    { value: 'simple', label: 'Simple' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');
    
    // Validate input
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);

    try {
      console.log(`INFO: Generating exercises for topic: ${topic}, tone: ${tone}`);
      
      const response = await exerciseAPI.generateExercises(topic.trim(), tone);
      
      if (response.success) {
        console.log('INFO: Exercises generated successfully:', response);
        onExercisesGenerated(response);
      } else {
        throw new Error(response.message || 'Failed to generate exercises');
      }
    } catch (error) {
      console.error('ERROR: Failed to generate exercises:', error);
      const errorMessage = handleError(error, { topic, tone });
      setError(errorMessage);
      onError && onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Exercise Generator
          </h1>
          <p className="text-xl text-white/90">
            Choose your topic and generate personalized quiz exercises
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to learn about?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., JavaScript, History, Science, Cooking..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={isLoading}
              />
            </div>

            {/* Tone Selection */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                Choose the tone for your exercises:
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                disabled={isLoading}
              >
                {toneOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Exercises...
                </div>
              ) : (
                'Generate Exercises'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              Enter any topic you'd like to learn about. Our AI will generate personalized quiz questions for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicInput;