// ProgressIndicator component for showing quiz progress
import React from 'react';

const ProgressIndicator = ({ currentQuestion, totalQuestions, timeSpent }) => {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">
            Question
          </span>
          <span className="text-lg font-bold text-gray-800">
            {currentQuestion}
          </span>
          <span className="text-sm text-gray-500">
            of
          </span>
          <span className="text-lg font-bold text-gray-800">
            {totalQuestions}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600">
            {Math.round(progress)}%
          </div>
          <div className="text-sm font-medium text-gray-600">
            Time: {formatTime(timeSpent)}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;