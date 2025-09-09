// ExerciseDisplay component for showing difficulty levels and starting quizzes
import React from 'react';

const ExerciseDisplay = ({ exercises, topic, onStartQuiz = () => {}, onBack = () => {}, onRegenerate = () => {} }) => {
  const difficultyLevels = [
    {
      key: 'beginner',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      icon: '🌱',
      title: 'Beginner',
      description: 'Basic concepts and fundamentals',
      questionCount: 'Questions',
      startButton: 'Start Quiz'
    },
    {
      key: 'intermediate',
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'hover:from-yellow-600 hover:to-orange-600',
      icon: '⚡',
      title: 'Intermediate',
      description: 'Moderate complexity and practical applications',
      questionCount: 'Questions',
      startButton: 'Start Quiz'
    },
    {
      key: 'expert',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700',
      icon: '🔥',
      title: 'Expert',
      description: 'Advanced concepts and complex scenarios',
      questionCount: 'Questions',
      startButton: 'Start Quiz'
    }
  ];

  const getExerciseByDifficulty = (difficulty) => {
    return exercises?.find(exercise => exercise.difficulty === difficulty);
  };

  const getQuestionCount = (difficulty) => {
    const exercise = getExerciseByDifficulty(difficulty);
    return exercise?.questions?.length || 0;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Difficulty Level
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Topic: <span className="font-semibold">{topic}</span>
          </p>
          <p className="text-lg text-white/80">
            Select a difficulty level to start your quiz
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {difficultyLevels.map((level) => {
            const exercise = getExerciseByDifficulty(level.key);
            const questionCount = getQuestionCount(level.key);
            const isAvailable = exercise && questionCount > 0;

            return (
              <div
                key={level.key}
                className={`bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                  isAvailable ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && onStartQuiz(exercise)}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${level.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{level.title}</h3>
                      <p className="text-white/90 mt-1">{level.description}</p>
                    </div>
                    <div className="text-4xl">{level.icon}</div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-800 mb-2">
                      {questionCount}
                    </div>
                    <div className="text-gray-600">
                      {level.questionCount}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Multiple choice questions
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Detailed explanations
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Instant feedback
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAvailable) onStartQuiz(exercise);
                    }}
                    disabled={!isAvailable}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isAvailable
                        ? `bg-gradient-to-r ${level.color} ${level.hoverColor} hover:shadow-lg`
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? level.startButton : 'Not Available'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            ← Back to Topic
          </button>
          <button
            onClick={onRegenerate}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            🔄 Regenerate Exercises
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDisplay;