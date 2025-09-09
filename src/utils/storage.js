// Storage utilities for managing local data persistence
const STORAGE_KEYS = {
  LANGUAGE: 'exercise_generator_language',
  QUIZ_SCORES: 'exercise_generator_scores',
  QUIZ_HISTORY: 'exercise_generator_history',
  USER_PREFERENCES: 'exercise_generator_preferences',
  BACKGROUND_CACHE: 'exercise_generator_background_cache'
};

// Language preferences
export const languageStorage = {
  save: (language) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      console.log(`INFO: Language preference saved: ${language}`);
    } catch (error) {
      console.error('ERROR: Failed to save language preference:', error);
    }
  },
  
  load: () => {
    try {
      const language = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return language || 'en'; // Default to English
    } catch (error) {
      console.error('ERROR: Failed to load language preference:', error);
      return 'en';
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.error('ERROR: Failed to clear language preference:', error);
    }
  }
};

// Quiz scores and statistics
export const scoreStorage = {
  save: (quizData) => {
    try {
      const scores = scoreStorage.load();
      const newScore = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        topic: quizData.topic,
        difficulty: quizData.difficulty,
        score: quizData.score,
        totalQuestions: quizData.totalQuestions,
        correctAnswers: quizData.correctAnswers,
        timeSpent: quizData.timeSpent,
        language: quizData.language,
        tone: quizData.tone
      };
      
      scores.unshift(newScore); // Add to beginning
      
      // Keep only last 50 scores
      if (scores.length > 50) {
        scores.splice(50);
      }
      
      localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
      console.log(`INFO: Quiz score saved: ${newScore.score}/${newScore.totalQuestions}`);
      
      return newScore;
    } catch (error) {
      console.error('ERROR: Failed to save quiz score:', error);
      return null;
    }
  },
  
  load: () => {
    try {
      const scores = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
      return scores ? JSON.parse(scores) : [];
    } catch (error) {
      console.error('ERROR: Failed to load quiz scores:', error);
      return [];
    }
  },
  
  getStats: () => {
    try {
      const scores = scoreStorage.load();
      
      if (scores.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalQuestions: 0,
          totalCorrect: 0
        };
      }
      
      const totalQuizzes = scores.length;
      const totalQuestions = scores.reduce((sum, score) => sum + score.totalQuestions, 0);
      const totalCorrect = scores.reduce((sum, score) => sum + score.correctAnswers, 0);
      const averageScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
      const bestScore = Math.max(...scores.map(score => (score.correctAnswers / score.totalQuestions) * 100));
      
      return {
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        bestScore: Math.round(bestScore * 100) / 100,
        totalQuestions,
        totalCorrect
      };
    } catch (error) {
      console.error('ERROR: Failed to calculate stats:', error);
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
        totalCorrect: 0
      };
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORES);
      console.log('INFO: Quiz scores cleared');
    } catch (error) {
      console.error('ERROR: Failed to clear quiz scores:', error);
    }
  }
};

// Quiz history for tracking user progress
export const historyStorage = {
  save: (historyData) => {
    try {
      const history = historyStorage.load();
      const newEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        topic: historyData.topic,
        difficulty: historyData.difficulty,
        status: historyData.status, // 'completed', 'in_progress', 'abandoned'
        questionsAnswered: historyData.questionsAnswered || 0,
        totalQuestions: historyData.totalQuestions,
        language: historyData.language,
        tone: historyData.tone
      };
      
      // Update existing entry or add new one
      const existingIndex = history.findIndex(entry => 
        entry.topic === newEntry.topic && 
        entry.difficulty === newEntry.difficulty &&
        entry.status === 'in_progress'
      );
      
      if (existingIndex >= 0) {
        history[existingIndex] = newEntry;
      } else {
        history.unshift(newEntry);
      }
      
      // Keep only last 100 entries
      if (history.length > 100) {
        history.splice(100);
      }
      
      localStorage.setItem(STORAGE_KEYS.QUIZ_HISTORY, JSON.stringify(history));
      console.log(`INFO: Quiz history saved: ${newEntry.topic} - ${newEntry.difficulty}`);
      
      return newEntry;
    } catch (error) {
      console.error('ERROR: Failed to save quiz history:', error);
      return null;
    }
  },
  
  load: () => {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.QUIZ_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('ERROR: Failed to load quiz history:', error);
      return [];
    }
  },
  
  getRecentTopics: (limit = 10) => {
    try {
      const history = historyStorage.load();
      const completedTopics = history
        .filter(entry => entry.status === 'completed')
        .map(entry => entry.topic);
      
      // Get unique topics
      const uniqueTopics = [...new Set(completedTopics)];
      return uniqueTopics.slice(0, limit);
    } catch (error) {
      console.error('ERROR: Failed to get recent topics:', error);
      return [];
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
      console.log('INFO: Quiz history cleared');
    } catch (error) {
      console.error('ERROR: Failed to clear quiz history:', error);
    }
  }
};

// User preferences
export const preferencesStorage = {
  save: (preferences) => {
    try {
      const existingPrefs = preferencesStorage.load();
      const updatedPrefs = { ...existingPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
      console.log('INFO: User preferences saved:', updatedPrefs);
      return updatedPrefs;
    } catch (error) {
      console.error('ERROR: Failed to save user preferences:', error);
      return null;
    }
  },
  
  load: () => {
    try {
      const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : {
        defaultTone: 'professional',
        showTimer: true,
        autoAdvance: false,
        soundEnabled: true,
        theme: 'light'
      };
    } catch (error) {
      console.error('ERROR: Failed to load user preferences:', error);
      return {
        defaultTone: 'professional',
        showTimer: true,
        autoAdvance: false,
        soundEnabled: true,
        theme: 'light'
      };
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
      console.log('INFO: User preferences cleared');
    } catch (error) {
      console.error('ERROR: Failed to clear user preferences:', error);
    }
  }
};

// Background image cache
export const backgroundCache = {
  save: (topic, tone, imageData) => {
    try {
      const cache = backgroundCache.load();
      const key = `${topic}_${tone}`;
      cache[key] = {
        ...imageData,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      // Clean up expired entries
      Object.keys(cache).forEach(cacheKey => {
        if (cache[cacheKey].expiresAt < Date.now()) {
          delete cache[cacheKey];
        }
      });
      
      localStorage.setItem(STORAGE_KEYS.BACKGROUND_CACHE, JSON.stringify(cache));
      console.log(`INFO: Background image cached for: ${key}`);
      return cache[key];
    } catch (error) {
      console.error('ERROR: Failed to cache background image:', error);
      return null;
    }
  },
  
  load: () => {
    try {
      const cache = localStorage.getItem(STORAGE_KEYS.BACKGROUND_CACHE);
      return cache ? JSON.parse(cache) : {};
    } catch (error) {
      console.error('ERROR: Failed to load background cache:', error);
      return {};
    }
  },
  
  get: (topic, tone) => {
    try {
      const cache = backgroundCache.load();
      const key = `${topic}_${tone}`;
      const cached = cache[key];
      
      if (cached && cached.expiresAt > Date.now()) {
        console.log(`INFO: Background image found in cache: ${key}`);
        return cached;
      }
      
      return null;
    } catch (error) {
      console.error('ERROR: Failed to get cached background:', error);
      return null;
    }
  },
  
  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.BACKGROUND_CACHE);
      console.log('INFO: Background cache cleared');
    } catch (error) {
      console.error('ERROR: Failed to clear background cache:', error);
    }
  }
};

// Clear all storage
export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('INFO: All storage cleared');
  } catch (error) {
    console.error('ERROR: Failed to clear all storage:', error);
  }
};

// Export all storage utilities
export default {
  languageStorage,
  scoreStorage,
  historyStorage,
  preferencesStorage,
  backgroundCache,
  clearAllStorage
};
