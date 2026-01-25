import { useState, useEffect, useCallback, useRef } from 'react';
import IPAKeyboard from './IPAKeyboard';
import Confetti from './Confetti';
import { getRandomWord, levelInfo } from '../data/wordDatabase';
import { checkAnswer } from '../data/wordDatabase';
import '../styles/timedMode.css';

/**
 * TimedMode component
 * 60-second speed challenge mode
 */
export function TimedMode({ onEnd, onBack }) {
    const [timeLeft, setTimeLeft] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [lastFeedback, setLastFeedback] = useState(null);
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const timerRef = useRef(null);

    // Start the game
    const startGame = useCallback(() => {
        setIsRunning(true);
        setTimeLeft(60);
        setScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setStreak(0);
        setShowResult(false);
        setCurrentWord(getRandomWord('level1')); // Start with easy words
    }, []);

    // Timer countdown
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            setShowResult(true);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isRunning, timeLeft]);

    // Get a level-appropriate word based on current streak
    const getNextWord = useCallback(() => {
        // Progressive difficulty based on streak
        let level = 'level1';
        if (streak >= 15) level = 'level4';
        else if (streak >= 10) level = 'level3';
        else if (streak >= 5) level = 'level2';

        return getRandomWord(level);
    }, [streak]);

    // Submit answer
    const submitAnswer = useCallback(() => {
        if (!currentWord || !userInput.trim()) return;

        const isCorrect = checkAnswer(userInput, currentWord.ipa);

        if (isCorrect) {
            const streakBonus = Math.floor(streak / 3) * 5;
            const points = 10 + streakBonus;
            setScore(prev => prev + points);
            setCorrectCount(prev => prev + 1);
            setStreak(prev => prev + 1);
            setLastFeedback({ type: 'correct', points });
            setConfettiTrigger(prev => prev + 1);
        } else {
            setWrongCount(prev => prev + 1);
            setStreak(0);
            setLastFeedback({ type: 'incorrect', correct: currentWord.ipa });
        }

        // Next word
        setUserInput('');
        setCurrentWord(getNextWord());

        // Clear feedback after short delay
        setTimeout(() => setLastFeedback(null), 800);
    }, [currentWord, userInput, streak, getNextWord]);

    // Handle keyboard input
    const handleKeyPress = useCallback((symbol) => {
        if (!isRunning) return;
        setUserInput(prev => prev + symbol);
    }, [isRunning]);

    const handleBackspace = useCallback(() => {
        setUserInput(prev => prev.slice(0, -1));
    }, []);

    const handleClear = useCallback(() => {
        setUserInput('');
    }, []);

    // Handle enter key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isRunning) {
                e.preventDefault();
                submitAnswer();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isRunning, submitAnswer]);

    // Pre-game screen
    if (!isRunning && !showResult) {
        return (
            <div className="timed-mode-container">
                <div className="timed-mode-intro">
                    <div className="timed-mode-icon">⏱️</div>
                    <h1 className="timed-mode-title">Timed Mode</h1>
                    <p className="timed-mode-subtitle">
                        How many words can you transcribe in 60 seconds?
                    </p>
                    <div className="timed-mode-rules">
                        <div className="rule-item">
                            <span className="rule-icon">⚡</span>
                            <span>Type IPA transcriptions as fast as you can</span>
                        </div>
                        <div className="rule-item">
                            <span className="rule-icon">🔥</span>
                            <span>Build streaks for bonus points</span>
                        </div>
                        <div className="rule-item">
                            <span className="rule-icon">📈</span>
                            <span>Words get harder as you improve</span>
                        </div>
                    </div>
                    <div className="timed-mode-buttons">
                        <button className="btn btn-primary start-btn" onClick={startGame}>
                            Start Challenge
                        </button>
                        <button className="btn btn-ghost" onClick={onBack}>
                            ← Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results screen
    if (showResult) {
        const accuracy = correctCount + wrongCount > 0
            ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
            : 0;

        return (
            <div className="timed-mode-container">
                <div className="timed-mode-results">
                    <div className="results-header">
                        <span className="results-icon">🏁</span>
                        <h1>Time's Up!</h1>
                    </div>

                    <div className="results-score">
                        <div className="score-big">{score}</div>
                        <div className="score-label">Total Points</div>
                    </div>

                    <div className="results-stats-grid">
                        <div className="result-stat">
                            <span className="stat-value correct">{correctCount}</span>
                            <span className="stat-label">Correct</span>
                        </div>
                        <div className="result-stat">
                            <span className="stat-value wrong">{wrongCount}</span>
                            <span className="stat-label">Wrong</span>
                        </div>
                        <div className="result-stat">
                            <span className="stat-value">{accuracy}%</span>
                            <span className="stat-label">Accuracy</span>
                        </div>
                        <div className="result-stat">
                            <span className="stat-value streak">{streak}</span>
                            <span className="stat-label">Best Streak</span>
                        </div>
                    </div>

                    <div className="results-buttons">
                        <button className="btn btn-primary" onClick={startGame}>
                            Try Again
                        </button>
                        <button className="btn btn-secondary" onClick={() => onEnd?.(score, correctCount)}>
                            Back to Menu
                        </button>
                    </div>
                </div>
                <Confetti trigger={score >= 100 ? 1 : 0} />
            </div>
        );
    }

    // Game screen
    return (
        <div className="timed-mode-container">
            <div className="timed-mode-game">
                {/* Timer Bar */}
                <div className="timer-bar">
                    <div
                        className="timer-fill"
                        style={{ width: `${(timeLeft / 60) * 100}%` }}
                    />
                    <span className="timer-text">{timeLeft}s</span>
                </div>

                {/* Stats Row */}
                <div className="timed-stats-row">
                    <div className="timed-stat">
                        <span className="stat-icon">💰</span>
                        <span className="stat-value">{score}</span>
                    </div>
                    <div className="timed-stat">
                        <span className="stat-icon">✓</span>
                        <span className="stat-value">{correctCount}</span>
                    </div>
                    {streak > 0 && (
                        <div className="timed-stat streak">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-value">{streak}</span>
                        </div>
                    )}
                </div>

                {/* Word Display */}
                <div className="timed-word-card">
                    <div className="word-label">Transcribe:</div>
                    <div className="word-text">{currentWord?.word}</div>
                </div>

                {/* Feedback Flash */}
                {lastFeedback && (
                    <div className={`timed-feedback ${lastFeedback.type}`}>
                        {lastFeedback.type === 'correct'
                            ? `+${lastFeedback.points}`
                            : `✗ ${lastFeedback.correct}`
                        }
                    </div>
                )}

                {/* Input */}
                <div className="timed-input-card">
                    <span className="input-text">
                        {userInput || <span className="placeholder">Type IPA...</span>}
                    </span>
                </div>

                {/* Keyboard */}
                <IPAKeyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onClear={handleClear}
                />

                {/* Submit Button */}
                <button
                    className="btn btn-primary submit-btn"
                    onClick={submitAnswer}
                    disabled={!userInput.trim()}
                >
                    Submit (Enter)
                </button>
            </div>

            <Confetti trigger={confettiTrigger} />
        </div>
    );
}

export default TimedMode;
