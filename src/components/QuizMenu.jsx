import { levelInfo } from '../data/wordDatabase';
import '../styles/quizMenu.css';

/**
 * Quiz-practice menu. All levels are always available — this is a practice
 * tool, so there is no locking, scoring history, or progress tracking.
 */
export function QuizMenu({
    onStartGame,
    onStartTimedMode,
    onOpenLearnMode,
    onOpenLiveCaption,
    onBack,
}) {
    const levels = Object.entries(levelInfo);

    return (
        <div className="quiz-menu">
            <div className="quiz-menu-content">
                <header className="quiz-menu-header">
                    <button className="quiz-back" onClick={onBack}>
                        ← Games
                    </button>
                    <div>
                        <h1>IPA Quiz Practice</h1>
                        <p>Pick a direction and a difficulty to begin.</p>
                    </div>
                </header>

                {/* Extra practice modes */}
                <div className="quiz-special-modes">
                    <button className="quiz-special-card timed" onClick={onStartTimedMode}>
                        <span className="quiz-special-icon">⏱️</span>
                        <span className="quiz-special-text">
                            <strong>Timed Mode</strong>
                            <small>60-second speed challenge</small>
                        </span>
                    </button>
                    <button className="quiz-special-card learn" onClick={onOpenLearnMode}>
                        <span className="quiz-special-icon">📚</span>
                        <span className="quiz-special-text">
                            <strong>Learn Mode</strong>
                            <small>Symbol tutorials &amp; minimal pairs</small>
                        </span>
                    </button>
                    <button className="quiz-special-card live" onClick={onOpenLiveCaption}>
                        <span className="quiz-special-icon">🎙️</span>
                        <span className="quiz-special-text">
                            <strong>Live IPA Caption</strong>
                            <small>Real-time speech-to-IPA</small>
                        </span>
                    </button>
                </div>

                {/* Levels */}
                <h2 className="quiz-section-title">Difficulty Levels</h2>
                <div className="quiz-levels-grid">
                    {levels.map(([levelKey, info], index) => (
                        <div
                            key={levelKey}
                            className="quiz-level-card"
                            style={{ '--level-color': info.color }}
                        >
                            <span className="quiz-level-number">Level {index + 1}</span>
                            <h3 className="quiz-level-name">{info.name}</h3>
                            <p className="quiz-level-description">{info.description}</p>
                            <div className="quiz-level-buttons">
                                <button
                                    className="btn btn-primary quiz-level-btn"
                                    onClick={() => onStartGame('wordToIpa', levelKey)}
                                >
                                    Word → IPA
                                </button>
                                <button
                                    className="btn btn-secondary quiz-level-btn"
                                    onClick={() => onStartGame('ipaToWord', levelKey)}
                                >
                                    IPA → Word
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizMenu;
