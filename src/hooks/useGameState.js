import { useState, useCallback, useEffect } from 'react';
import { wordDatabase, levelInfo, getRandomWord, checkAnswer } from '../data/wordDatabase';

const INITIAL_STATE = {
    screen: 'title', // 'title', 'menu', 'game', 'results'
    gameMode: null, // 'wordToIpa', 'ipaToWord'
    currentLevel: 'level1',
    currentWord: null,
    userInput: '',
    score: 0,
    streak: 0,
    bestStreak: 0,
    roundsPlayed: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    showFeedback: false,
    feedbackType: null, // 'correct', 'incorrect'
    unlockedLevels: ['level1'],
    levelProgress: {
        level1: { correct: 0, attempts: 0, stars: 0 },
        level2: { correct: 0, attempts: 0, stars: 0 },
        level3: { correct: 0, attempts: 0, stars: 0 },
        level4: { correct: 0, attempts: 0, stars: 0 },
        level5: { correct: 0, attempts: 0, stars: 0 },
    },
    recentAnswers: [], // Track last few answers for review
};

// Load saved progress from localStorage
const loadProgress = () => {
    try {
        const saved = localStorage.getItem('ipa-game-progress');
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...INITIAL_STATE,
                unlockedLevels: parsed.unlockedLevels || INITIAL_STATE.unlockedLevels,
                levelProgress: parsed.levelProgress || INITIAL_STATE.levelProgress,
                bestStreak: parsed.bestStreak || 0,
            };
        }
    } catch (e) {
        console.warn('Failed to load progress:', e);
    }
    return INITIAL_STATE;
};

// Save progress to localStorage
const saveProgress = (state) => {
    try {
        localStorage.setItem('ipa-game-progress', JSON.stringify({
            unlockedLevels: state.unlockedLevels,
            levelProgress: state.levelProgress,
            bestStreak: state.bestStreak,
        }));
    } catch (e) {
        console.warn('Failed to save progress:', e);
    }
};

export function useGameState() {
    const [state, setState] = useState(loadProgress);

    // Save progress when relevant state changes
    useEffect(() => {
        saveProgress(state);
    }, [state.unlockedLevels, state.levelProgress, state.bestStreak]);

    // Navigate to different screens
    const goToScreen = useCallback((screen) => {
        setState(prev => ({ ...prev, screen }));
    }, []);

    // Start a new game
    const startGame = useCallback((mode, level) => {
        const word = getRandomWord(level);
        setState(prev => ({
            ...prev,
            screen: 'game',
            gameMode: mode,
            currentLevel: level,
            currentWord: word,
            userInput: '',
            score: 0,
            streak: 0,
            roundsPlayed: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            showFeedback: false,
            recentAnswers: [],
        }));
    }, []);

    // Update user input
    const updateInput = useCallback((input) => {
        setState(prev => ({ ...prev, userInput: input }));
    }, []);

    // Add a character to input
    const addToInput = useCallback((char) => {
        setState(prev => ({ ...prev, userInput: prev.userInput + char }));
    }, []);

    // Remove last character from input
    const backspace = useCallback(() => {
        setState(prev => ({
            ...prev,
            userInput: prev.userInput.slice(0, -1)
        }));
    }, []);

    // Clear input
    const clearInput = useCallback(() => {
        setState(prev => ({ ...prev, userInput: '' }));
    }, []);

    // Submit answer
    const submitAnswer = useCallback(() => {
        setState(prev => {
            if (!prev.currentWord || !prev.userInput.trim()) return prev;

            const isWordToIpa = prev.gameMode === 'wordToIpa';
            const correctAnswer = isWordToIpa ? prev.currentWord.ipa : prev.currentWord.word;
            const isCorrect = isWordToIpa
                ? checkAnswer(prev.userInput, prev.currentWord.ipa)
                : prev.userInput.trim().toLowerCase() === prev.currentWord.word.toLowerCase();

            const newStreak = isCorrect ? prev.streak + 1 : 0;
            const streakBonus = isCorrect ? Math.floor(prev.streak / 3) * 5 : 0;
            const basePoints = isCorrect ? 10 : 0;
            const newScore = prev.score + basePoints + streakBonus;
            const newBestStreak = Math.max(prev.bestStreak, newStreak);

            // Update level progress
            const newLevelProgress = { ...prev.levelProgress };
            const levelData = newLevelProgress[prev.currentLevel];
            newLevelProgress[prev.currentLevel] = {
                ...levelData,
                correct: levelData.correct + (isCorrect ? 1 : 0),
                attempts: levelData.attempts + 1,
            };

            // Check for level unlock
            const newUnlockedLevels = [...prev.unlockedLevels];
            const levels = ['level1', 'level2', 'level3', 'level4', 'level5'];
            const currentLevelIndex = levels.indexOf(prev.currentLevel);
            const nextLevel = levels[currentLevelIndex + 1];

            if (nextLevel && !newUnlockedLevels.includes(nextLevel)) {
                const required = levelInfo[prev.currentLevel].requiredCorrect;
                if (newLevelProgress[prev.currentLevel].correct >= required) {
                    newUnlockedLevels.push(nextLevel);
                }
            }

            // Calculate stars for current level
            const accuracy = newLevelProgress[prev.currentLevel].attempts > 0
                ? newLevelProgress[prev.currentLevel].correct / newLevelProgress[prev.currentLevel].attempts
                : 0;
            if (accuracy >= 0.9) newLevelProgress[prev.currentLevel].stars = 3;
            else if (accuracy >= 0.7) newLevelProgress[prev.currentLevel].stars = 2;
            else if (accuracy >= 0.5) newLevelProgress[prev.currentLevel].stars = 1;

            // Track recent answer
            const recentAnswer = {
                word: prev.currentWord.word,
                ipa: prev.currentWord.ipa,
                userAnswer: prev.userInput,
                isCorrect,
            };

            return {
                ...prev,
                score: newScore,
                streak: newStreak,
                bestStreak: newBestStreak,
                roundsPlayed: prev.roundsPlayed + 1,
                correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
                wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
                showFeedback: true,
                feedbackType: isCorrect ? 'correct' : 'incorrect',
                levelProgress: newLevelProgress,
                unlockedLevels: newUnlockedLevels,
                recentAnswers: [...prev.recentAnswers.slice(-9), recentAnswer],
            };
        });
    }, []);

    // Move to next word
    const nextWord = useCallback(() => {
        setState(prev => {
            const newWord = getRandomWord(prev.currentLevel);
            return {
                ...prev,
                currentWord: newWord,
                userInput: '',
                showFeedback: false,
                feedbackType: null,
            };
        });
    }, []);

    // End current game session
    const endGame = useCallback(() => {
        setState(prev => ({ ...prev, screen: 'results' }));
    }, []);

    // Reset all progress
    const resetProgress = useCallback(() => {
        localStorage.removeItem('ipa-game-progress');
        setState(INITIAL_STATE);
    }, []);

    return {
        state,
        goToScreen,
        startGame,
        updateInput,
        addToInput,
        backspace,
        clearInput,
        submitAnswer,
        nextWord,
        endGame,
        resetProgress,
    };
}
