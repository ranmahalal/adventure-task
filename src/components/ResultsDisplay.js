// ResultsDisplay component for showing quiz results and statistics
import React, { useState } from 'react';
import { scoreStorage } from '../utils/storage';

const ResultsDisplay = ({ result, onRestart = () => {}, onNewTopic = () => {}, onBack = () => {} }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const {
    topic,
    difficulty,
    questions,
    answers,
    score,
    totalQuestions,
    timeSpent
  } = result;

  const percentage = Math.round((score / totalQuestions) * 100);

  // Save score to storage
  React.useEffect(() => {
    const savedScore = scoreStorage.save({
      topic,
      difficulty,
      score,
      totalQuestions,
      correctAnswers: score,
      timeSpent,
      language: 'en'
    });
    
    if (savedScore) {
      console.log('INFO: Score saved successfully:', savedScore);
    }
  }, [topic, difficulty, score, totalQuestions, timeSpent]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreFeedback = (percentage) => {
    if (percentage >= 90) return 'Excellent performance!';
    if (percentage >= 70) return 'Good performance!';
    if (percentage >= 50) return 'Satisfactory performance';
    return 'Continue practicing to improve';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPercentage = (percentage) => {
    return `${percentage}%`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quiz Completed
          </h1>
          <p className="text-xl text-white/90">
            Topic: <span className="font-semibold">{topic}</span>
          </p>
          <p className="text-lg text-white/80">
            Difficulty: <span className="font-semibold">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Score Display */}
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
              {formatPercentage(percentage)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {getScoreFeedback(percentage)}
            </h2>
            <p className="text-lg text-gray-600">
              You scored {score} out of {totalQuestions} questions correctly
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {score}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {totalQuestions}
              </div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatTime(timeSpent)}
              </div>
              <div className="text-gray-600">Time Spent</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            >
              {showBreakdown ? 'Hide' : 'Show'} Answer Breakdown
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
              {showStats ? 'Hide' : 'Show'} Statistics
            </button>
          </div>
        </div>

        {/* Answer Breakdown */}
        {showBreakdown && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Answer Breakdown</h3>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Question {index + 1}
                      </h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-semibold">Your answer:</span> 
                        <span className={`ml-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {userAnswer || 'No answer'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">Correct answer:</span> 
                        <span className="ml-2 text-green-600">{question.correctAnswer}</span>
                      </div>
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-semibold text-blue-800 mb-1">Explanation:</div>
                        <div className="text-sm text-blue-700">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Statistics */}
        {showStats && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Overall Performance</h4>
                <div className="text-2xl font-bold text-blue-600">{formatPercentage(percentage)}</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Time Efficiency</h4>
                <div className="text-2xl font-bold text-green-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            🔄 Try Again
          </button>
          <button
            onClick={onNewTopic}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            🆕 New Topic
          </button>
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            ← Back to Exercises
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;