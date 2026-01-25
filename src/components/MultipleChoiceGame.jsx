import { useState, useEffect, useCallback } from 'react';
import { generateMultipleChoiceQuestion } from '../utils/multipleChoiceGenerator';
import { levelInfo } from '../data/wordDatabase';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import Confetti from './Confetti';
import '../styles/multipleChoiceGame.css';

export function MultipleChoiceGame({
    gameMode,
    currentLevel,
    onScoreUpdate,
    onBack,
    onEndGame
}) {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    const { speak, isSpeaking, isSupported: speechSupported } = useSpeechSynthesis();
    const levelData = levelInfo[currentLevel];

    // Load first question
    useEffect(() => {
        loadNewQuestion();
    }, [gameMode, currentLevel]);

    // Load a new question
    const loadNewQuestion = useCallback(() => {
        const newQuestion = generateMultipleChoiceQuestion(gameMode, currentLevel);
        setQuestion(newQuestion);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setIsCorrect(false);
        setShowExplanation(false);
    }, [gameMode, currentLevel]);

    // Handle answer selection
    const handleAnswerSelect = (option) => {
        if (showFeedback) return; // Prevent changing answer after submission

        setSelectedAnswer(option);
    };

    // Submit answer
    const handleSubmit = () => {
        if (!selectedAnswer) return;

        const correct = selectedAnswer.isCorrect;
        setIsCorrect(correct);
        setShowFeedback(true);
        setQuestionCount(prev => prev + 1);

        if (correct) {
            // Calculate points
            const basePoints = 10;
            const streakBonus = Math.floor(streak / 3) * 5;
            const points = basePoints + streakBonus;

            setScore(prev => prev + points);
            setCorrectCount(prev => prev + 1);
            setStreak(prev => {
                const newStreak = prev + 1;
                if (newStreak > bestStreak) {
                    setBestStreak(newStreak);
                }
                return newStreak;
            });
            setConfettiTrigger(prev => prev + 1);
        } else {
            setStreak(0);
        }

        // Update parent component
        if (onScoreUpdate) {
            onScoreUpdate({
                score: correct ? score + 10 + Math.floor(streak / 3) * 5 : score,
                correctCount: correct ? correctCount + 1 : correctCount,
                questionCount: questionCount + 1,
                streak: correct ? streak + 1 : 0
            });
        }
    };

    // Go to next question
    const handleNext = () => {
        loadNewQuestion();
    };

    // Toggle explanation panel
    const toggleExplanation = () => {
        setShowExplanation(prev => !prev);
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (showFeedback) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNext();
                }
                if (e.key === 'e' || e.key === 'E') {
                    toggleExplanation();
                }
            } else {
                // Number keys to select options
                if (e.key >= '1' && e.key <= '4') {
                    const index = parseInt(e.key) - 1;
                    if (question?.options[index]) {
                        handleAnswerSelect(question.options[index]);
                    }
                }
                // Enter to submit
                if (e.key === 'Enter' && selectedAnswer) {
                    handleSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [showFeedback, selectedAnswer, question]);

    const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

    if (!question) {
        return <div className="loading">Loading question...</div>;
    }

    return (
        <div className="mc-game-container">
            {/* Header */}
            <header className="mc-game-header">
                <div className="mc-header-left">
                    <button className="mc-back-button" onClick={onBack}>
                        ← Back
                    </button>
                    <div className="mc-level-badge" style={{ '--level-color': levelData.color }}>
                        <span className="mc-level-dot" style={{ background: levelData.color }}></span>
                        {levelData.name}
                    </div>
                </div>

                <div className="mc-header-right">
                    <div className="mc-score-display">
                        <div className="mc-score-item">
                            <span className="mc-score-value">{score}</span>
                            <span className="mc-score-label">Score</span>
                        </div>
                        <div className="mc-score-item">
                            <span className="mc-score-value">{accuracy}%</span>
                            <span className="mc-score-label">Accuracy</span>
                        </div>
                        <div className="mc-score-item">
                            <span className="mc-score-value">{questionCount}</span>
                            <span className="mc-score-label">Questions</span>
                        </div>
                    </div>

                    {streak > 0 && (
                        <div className="mc-streak-display">
                            <span className="mc-streak-icon">🔥</span>
                            <span className="mc-streak-value">{streak}</span>
                        </div>
                    )}

                    <button className="btn btn-ghost" onClick={onEndGame}>
                        End Session
                    </button>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="mc-game-main">
                {/* Progress indicator */}
                <div className="mc-progress-indicator">
                    Question {questionCount + 1}
                    {bestStreak > 0 && <span className="mc-best-streak">Best Streak: {bestStreak} 🔥</span>}
                </div>

                {/* Question Card */}
                <div className="mc-question-card">
                    <div className="mc-question-label">
                        {gameMode === 'wordToIpa' ? 'What is the IPA transcription for this word?' : 'What word does this IPA represent?'}
                    </div>

                    <div className="mc-question-display">
                        {gameMode === 'wordToIpa' ? (
                            <div className="mc-question-word">
                                {question.question}
                                {speechSupported && (
                                    <button
                                        className={`mc-audio-button ${isSpeaking ? 'speaking' : ''}`}
                                        onClick={() => speak(question.question)}
                                        disabled={isSpeaking}
                                        title="Hear pronunciation"
                                    >
                                        {isSpeaking ? '🔊' : '🔈'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="mc-question-ipa">
                                /{question.question}/
                            </div>
                        )}
                    </div>

                    {question.hint && !showFeedback && (
                        <div className="mc-hint">
                            <span className="mc-hint-icon">💡</span>
                            {question.hint}
                        </div>
                    )}
                </div>

                {/* Options */}
                <div className="mc-options-grid">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const showCorrect = showFeedback && option.isCorrect;
                        const showWrong = showFeedback && isSelected && !option.isCorrect;

                        return (
                            <button
                                key={index}
                                className={`mc-option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''}`}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showFeedback}
                            >
                                <span className="mc-option-number">{index + 1}</span>
                                <span className="mc-option-text">
                                    {gameMode === 'wordToIpa' ? `/${option.text}/` : option.text}
                                </span>
                                {showCorrect && <span className="mc-option-icon">✓</span>}
                                {showWrong && <span className="mc-option-icon">✗</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Submit Button */}
                {!showFeedback && (
                    <div className="mc-submit-section">
                        <button
                            className="btn btn-primary mc-submit-button"
                            onClick={handleSubmit}
                            disabled={!selectedAnswer}
                        >
                            Check Answer
                        </button>
                        <div className="mc-keyboard-hint">
                            Press <kbd>1</kbd>-<kbd>4</kbd> to select, <kbd>Enter</kbd> to submit
                        </div>
                    </div>
                )}

                {/* Feedback Section */}
                {showFeedback && (
                    <div className={`mc-feedback-section ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="mc-feedback-header">
                            <div className="mc-feedback-icon">
                                {isCorrect ? '🎉' : '😕'}
                            </div>
                            <h2 className="mc-feedback-title">
                                {isCorrect ? 'Correct!' : 'Not quite...'}
                            </h2>
                        </div>

                        <div className="mc-feedback-details">
                            <div className="mc-feedback-answer">
                                <span className="mc-feedback-label">Correct answer:</span>
                                <span className="mc-feedback-value">
                                    {gameMode === 'wordToIpa'
                                        ? `${question.explanation.word} → /${question.explanation.ipa}/`
                                        : `/${question.explanation.ipa}/ → ${question.explanation.word}`
                                    }
                                </span>
                            </div>

                            {!isCorrect && (
                                <div className="mc-feedback-answer">
                                    <span className="mc-feedback-label">You selected:</span>
                                    <span className="mc-feedback-value wrong">
                                        {gameMode === 'wordToIpa' ? `/${selectedAnswer.text}/` : selectedAnswer.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Explanation Toggle */}
                        <button
                            className="mc-explanation-toggle"
                            onClick={toggleExplanation}
                        >
                            {showExplanation ? '▼' : '▶'} {showExplanation ? 'Hide' : 'Show'} Detailed Explanation
                            <kbd className="mc-key-hint">E</kbd>
                        </button>

                        {/* Detailed Explanation */}
                        {showExplanation && (
                            <div className="mc-explanation-panel">
                                {/* Phoneme Breakdown */}
                                <div className="mc-explanation-section">
                                    <h3>Phoneme Breakdown</h3>
                                    <div className="mc-phoneme-list">
                                        {question.explanation.breakdown.map((phoneme, idx) => (
                                            <div key={idx} className="mc-phoneme-item">
                                                <span className="mc-phoneme-symbol">/{phoneme.symbol}/</span>
                                                <span className="mc-phoneme-desc">{phoneme.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Phonetic Processes */}
                                {question.explanation.phoneticProcess.length > 0 && (
                                    <div className="mc-explanation-section">
                                        <h3>Phonetic Processes</h3>
                                        <div className="mc-process-list">
                                            {question.explanation.phoneticProcess.map((process, idx) => (
                                                <div key={idx} className="mc-process-item">
                                                    <div className="mc-process-name">{process.name}</div>
                                                    <div className="mc-process-desc">{process.description}</div>
                                                    {process.example && (
                                                        <div className="mc-process-example">
                                                            Example: {process.example}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tip */}
                                <div className="mc-explanation-section">
                                    <div className="mc-tip-box">
                                        <span className="mc-tip-icon">💡</span>
                                        <span className="mc-tip-text">{question.explanation.tip}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Points Earned */}
                        {isCorrect && (
                            <div className="mc-points-earned">
                                <span className="mc-points-label">Points Earned:</span>
                                <span className="mc-points-value">+{10 + Math.floor((streak - 1) / 3) * 5}</span>
                            </div>
                        )}

                        {/* Next Button */}
                        <div className="mc-feedback-actions">
                            <button
                                className="btn btn-primary mc-next-button"
                                onClick={handleNext}
                            >
                                Next Question →
                            </button>
                            <div className="mc-keyboard-hint">
                                Press <kbd>Enter</kbd> or <kbd>Space</kbd>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Confetti Effect */}
            <Confetti trigger={confettiTrigger} />
        </div>
    );
}

export default MultipleChoiceGame;
