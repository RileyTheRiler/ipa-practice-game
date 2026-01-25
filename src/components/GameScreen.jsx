import { useState, useEffect, useCallback, useMemo } from 'react';
import IPAKeyboard from './IPAKeyboard';
import Confetti from './Confetti';
import CharacterDiff from './CharacterDiff';
import { levelInfo } from '../data/wordDatabase';
import { getIPAFromKeyEvent, shortcutGuide } from '../data/keyboardShortcuts';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { compareIPA, getFeedbackMessage, getWrongSymbolExplanations } from '../utils/ipaCompare';
import '../styles/game.css';

export function GameScreen({
    gameMode,
    currentLevel,
    currentWord,
    userInput,
    score,
    streak,
    correctAnswers,
    wrongAnswers,
    showFeedback,
    feedbackType,
    onAddToInput,
    onBackspace,
    onClearInput,
    onUpdateInput,
    onSubmit,
    onNextWord,
    onEndGame,
    onBack,
}) {
    const [scorePopup, setScorePopup] = useState(null);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [confettiTrigger, setConfettiTrigger] = useState(0);
    const { speak, isSpeaking, isSupported: speechSupported } = useSpeechSynthesis();
    const levelData = levelInfo[currentLevel];
    const isWordToIpa = gameMode === 'wordToIpa';

    // Handle physical keyboard input
    const handleKeyDown = useCallback((e) => {
        if (showFeedback) {
            // Allow Enter/Space to go to next word when showing feedback
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNextWord();
            }
            return;
        }

        // For IPA → Word mode, let the input handle itself
        if (!isWordToIpa) {
            if (e.key === 'Enter') {
                e.preventDefault();
                onSubmit();
            }
            return;
        }

        // Word → IPA mode: Handle keyboard shortcuts
        e.preventDefault();

        if (e.key === 'Backspace') {
            onBackspace();
            return;
        }

        if (e.key === 'Escape') {
            onClearInput();
            return;
        }

        if (e.key === 'Enter') {
            onSubmit();
            return;
        }

        // Toggle shortcuts help with ?
        if (e.key === '?' || (e.shiftKey && e.key === '/')) {
            setShowShortcuts(prev => !prev);
            return;
        }

        // Try to convert key to IPA symbol
        const ipaSymbol = getIPAFromKeyEvent(e);
        if (ipaSymbol) {
            onAddToInput(ipaSymbol);
        }
    }, [isWordToIpa, showFeedback, onSubmit, onBackspace, onClearInput, onAddToInput, onNextWord]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Show score popup and confetti on correct answer
    useEffect(() => {
        if (feedbackType === 'correct') {
            const points = 10 + Math.floor(streak / 3) * 5;
            setScorePopup(`+${points}`);
            setConfettiTrigger(prev => prev + 1);
            setTimeout(() => setScorePopup(null), 1000);
        }
    }, [feedbackType, streak]);

    // Calculate comparison data when feedback shows for incorrect answers
    const comparisonData = useMemo(() => {
        if (showFeedback && feedbackType === 'incorrect' && isWordToIpa && currentWord?.ipa) {
            return compareIPA(userInput, currentWord.ipa);
        }
        return null;
    }, [showFeedback, feedbackType, isWordToIpa, userInput, currentWord?.ipa]);

    const feedbackMessage = useMemo(() => {
        if (comparisonData) {
            return getFeedbackMessage(comparisonData);
        }
        return null;
    }, [comparisonData]);

    const wrongExplanations = useMemo(() => {
        if (comparisonData?.diff) {
            return getWrongSymbolExplanations(comparisonData.diff).slice(0, 3); // Max 3 explanations
        }
        return [];
    }, [comparisonData?.diff]);

    const accuracy = (correctAnswers + wrongAnswers) > 0
        ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
        : 0;

    return (
        <div className="game-container">
            {/* Header */}
            <header className="game-header">
                <div className="game-header-left">
                    <button className="back-button" onClick={onBack}>
                        ← Back
                    </button>
                    <div className="level-badge" style={{ '--level-color': levelData.color }}>
                        <span className="level-dot" style={{ background: levelData.color }}></span>
                        {levelData.name}
                    </div>
                </div>

                <div className="game-header-right">
                    <div className="score-display">
                        <div className="score-item">
                            <span className="score-value">{score}</span>
                            <span className="score-label">Score</span>
                        </div>
                        <div className="score-item">
                            <span className="score-value">{accuracy}%</span>
                            <span className="score-label">Accuracy</span>
                        </div>
                    </div>

                    {streak > 0 && (
                        <div className="streak-display">
                            <span className="streak-icon">🔥</span>
                            <span className="streak-value">{streak}</span>
                        </div>
                    )}

                    {isWordToIpa && (
                        <button
                            className="btn btn-ghost shortcuts-toggle"
                            onClick={() => setShowShortcuts(prev => !prev)}
                            title="Keyboard Shortcuts (?)"
                        >
                            ⌨️ Shortcuts
                        </button>
                    )}

                    <button className="btn btn-ghost" onClick={onEndGame}>
                        End Session
                    </button>
                </div>
            </header>

            {/* Main Game Area */}
            <main className="game-main">
                {/* Keyboard shortcuts notice */}
                {isWordToIpa && !showFeedback && (
                    <div className="keyboard-notice">
                        💡 <strong>Tip:</strong> Use your keyboard! Press <kbd>?</kbd> for shortcuts or click/tap the virtual keyboard below.
                    </div>
                )}

                {/* Word/IPA Display */}
                <div className="word-display-card">
                    <div className="mode-label">
                        {isWordToIpa ? 'Transcribe this word' : 'What word is this?'}
                    </div>
                    <div className="word-display-row">
                        <div className={`word-to-transcribe ${!isWordToIpa ? 'ipa' : ''}`}>
                            {isWordToIpa ? currentWord?.word : `/${currentWord?.ipa}/`}
                        </div>
                        {speechSupported && isWordToIpa && (
                            <button
                                className={`audio-button ${isSpeaking ? 'speaking' : ''}`}
                                onClick={() => speak(currentWord?.word)}
                                disabled={isSpeaking}
                                title="Hear pronunciation"
                            >
                                {isSpeaking ? '🔊' : '🔈'}
                            </button>
                        )}
                    </div>
                    {currentWord?.hint && (
                        <div className="word-hint">
                            <span className="hint-icon">💡</span>
                            {currentWord.hint}
                        </div>
                    )}
                </div>

                {/* Input Display */}
                <div className="input-display-card">
                    <div className="input-label">
                        {isWordToIpa ? 'Your IPA Transcription' : 'Your Answer'}
                    </div>

                    {isWordToIpa ? (
                        <div className="input-text-wrapper">
                            <span className="input-text">
                                {userInput || <span className="input-placeholder">Start typing or use keyboard below...</span>}
                            </span>
                            {!showFeedback && <span className="input-cursor"></span>}
                        </div>
                    ) : (
                        <input
                            type="text"
                            className="standard-input"
                            value={userInput}
                            onChange={(e) => onUpdateInput(e.target.value)}
                            placeholder="Type the word..."
                            disabled={showFeedback}
                            autoFocus
                        />
                    )}
                </div>

                {/* IPA Keyboard (only for Word → IPA mode) */}
                {isWordToIpa && !showFeedback && (
                    <IPAKeyboard
                        onKeyPress={onAddToInput}
                        onBackspace={onBackspace}
                        onClear={onClearInput}
                    />
                )}

                {/* Submit Button */}
                {!showFeedback && (
                    <div className="submit-section">
                        <button
                            className="btn btn-primary submit-button"
                            onClick={onSubmit}
                            disabled={!userInput.trim()}
                        >
                            Check Answer
                        </button>
                        <span className="submit-hint">or press Enter</span>
                    </div>
                )}
            </main>

            {/* Score Popup */}
            {scorePopup && (
                <div className="score-popup" style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: 'var(--color-success)',
                    animation: 'scorePopUp 1s ease forwards',
                    pointerEvents: 'none',
                    zIndex: 200
                }}>
                    {scorePopup}
                </div>
            )}

            {/* Shortcuts Help Panel */}
            {showShortcuts && (
                <div className="shortcuts-overlay" onClick={() => setShowShortcuts(false)}>
                    <div className="shortcuts-panel" onClick={e => e.stopPropagation()}>
                        <div className="shortcuts-header">
                            <h2>⌨️ Keyboard Shortcuts</h2>
                            <button className="close-btn" onClick={() => setShowShortcuts(false)}>×</button>
                        </div>
                        <div className="shortcuts-content">
                            {shortcutGuide.map(category => (
                                <div key={category.category} className="shortcut-category">
                                    <h3>{category.category}</h3>
                                    <div className="shortcut-list">
                                        {category.shortcuts.map((shortcut, idx) => (
                                            <div key={idx} className="shortcut-row">
                                                <kbd className="shortcut-keys">{shortcut.keys}</kbd>
                                                <span className="shortcut-arrow">→</span>
                                                <span className="shortcut-symbol">{shortcut.symbol}</span>
                                                <span className="shortcut-example">({shortcut.example})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="shortcut-category">
                                <h3>Controls</h3>
                                <div className="shortcut-list">
                                    <div className="shortcut-row">
                                        <kbd className="shortcut-keys">Enter</kbd>
                                        <span className="shortcut-arrow">→</span>
                                        <span className="shortcut-example">Submit answer</span>
                                    </div>
                                    <div className="shortcut-row">
                                        <kbd className="shortcut-keys">Backspace</kbd>
                                        <span className="shortcut-arrow">→</span>
                                        <span className="shortcut-example">Delete last character</span>
                                    </div>
                                    <div className="shortcut-row">
                                        <kbd className="shortcut-keys">Escape</kbd>
                                        <span className="shortcut-arrow">→</span>
                                        <span className="shortcut-example">Clear input</span>
                                    </div>
                                    <div className="shortcut-row">
                                        <kbd className="shortcut-keys">?</kbd>
                                        <span className="shortcut-arrow">→</span>
                                        <span className="shortcut-example">Toggle this help</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {showFeedback && (
                <div className="feedback-overlay">
                    <div className="feedback-card">
                        <div className="feedback-icon">
                            {feedbackType === 'correct' ? '🎉' : '😕'}
                        </div>
                        <h2 className={`feedback-title ${feedbackType}`}>
                            {feedbackType === 'correct' ? 'Correct!' : 'Not Quite...'}
                        </h2>

                        <div className="feedback-details">
                            <div className="feedback-row">
                                <span className="feedback-label">Word:</span>
                                <span className="feedback-value">{currentWord?.word}</span>
                            </div>
                            <div className="feedback-row">
                                <span className="feedback-label">Correct IPA:</span>
                                <span className="feedback-value correct-answer">/{currentWord?.ipa}/</span>
                            </div>
                            {feedbackType === 'incorrect' && (
                                <div className="feedback-row">
                                    <span className="feedback-label">Your Answer:</span>
                                    <span className="feedback-value user-answer">{userInput}</span>
                                </div>
                            )}
                        </div>

                        {/* Character-by-character diff for wrong answers */}
                        {feedbackType === 'incorrect' && comparisonData && (
                            <>
                                {comparisonData.isClose && (
                                    <div className="almost-right-badge">
                                        <span className="badge-icon">🎯</span>
                                        Almost right! ({comparisonData.score}% match)
                                    </div>
                                )}
                                <CharacterDiff diff={comparisonData.diff} />

                                {wrongExplanations.length > 0 && (
                                    <div className="phonetic-explanation">
                                        <div className="explanation-title">Why it was wrong:</div>
                                        <div className="explanation-list">
                                            {wrongExplanations.map((exp, idx) => (
                                                <div key={idx} className="explanation-item">
                                                    <div className="explanation-symbols">
                                                        <span className="user-symbol">/{exp.userSymbol}/</span>
                                                        <span className="arrow">→</span>
                                                        <span className="correct-symbol">/{exp.expectedSymbol}/</span>
                                                    </div>
                                                    <div className="explanation-tip">{exp.tip}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {feedbackType === 'correct' && (
                            <div className="score-gained">
                                <div className="score-gained-label">Points Earned</div>
                                <div className="score-gained-value">
                                    +{10 + Math.floor((streak - 1) / 3) * 5}
                                </div>
                            </div>
                        )}

                        <div className="feedback-hint">
                            Press <kbd>Enter</kbd> or <kbd>Space</kbd> for next word
                        </div>

                        <div className="feedback-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={onNextWord}
                            >
                                Next Word →
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={onEndGame}
                            >
                                End Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Confetti Effect */}
            <Confetti trigger={confettiTrigger} />
        </div>
    );
}

export default GameScreen;
