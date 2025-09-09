// QuizInterface component for displaying and answering quiz questions
import React, { useState, useEffect } from 'react';
import ProgressIndicator from './ProgressIndicator';

const QuizInterface = ({ exercise, topic, onComplete = () => {}, onBack = () => {} }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [startTime] = useState(Date.now());

  const questions = exercise.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Load saved answer for current question
  useEffect(() => {
    const savedAnswer = answers[currentQuestionIndex];
    setSelectedAnswer(savedAnswer || '');
  }, [currentQuestionIndex, answers]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    const result = {
      score: correctAnswers,
      totalQuestions: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100),
      answers: answers,
      questions: questions,
      timeSpent: timeSpent,
      topic: topic,
      difficulty: exercise.difficulty
    };

    onComplete(result);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {topic} Quiz
          </h1>
          <p className="text-lg text-white/90">
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)} Level
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          timeSpent={timeSpent}
        />

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.choices.map((choice, index) => {
              const choiceLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === choiceLetter;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(choiceLetter)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {choiceLetter}
                    </div>
                    <span className="text-lg">{choice}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Submit Quiz' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 border border-white/30"
          >
            ← Back to Exercises
          </button>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Submit Quiz?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your quiz? You have answered {Object.keys(answers).length} out of {totalQuestions} questions.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;