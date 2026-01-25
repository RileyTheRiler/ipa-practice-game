import { useState, useMemo } from 'react';
import { levelInfo } from '../data/wordDatabase';
import { getDailyChallengeInfo, isDailyChallengeCompleted, getDailyStreak } from '../data/dailyChallenges';
import { getAchievementStats, getAllAchievementsWithStatus, getAchievementCategories } from '../data/achievements';
import './MenuScreen.css';

export function MenuScreen({
    onStartGame,
    onStartTimedMode,
    onStartDailyChallenge,
    onOpenLearnMode,
    unlockedLevels,
    levelProgress,
    bestStreak,
    onResetProgress
}) {
    const [showAchievements, setShowAchievements] = useState(false);
    const levels = Object.entries(levelInfo);

    const dailyInfo = useMemo(() => getDailyChallengeInfo(), []);
    const dailyCompleted = isDailyChallengeCompleted();
    const dailyStreak = getDailyStreak();
    const achievementStats = getAchievementStats();
    const achievements = getAllAchievementsWithStatus();
    const categories = getAchievementCategories();

    const renderStars = (starCount) => {
        return (
            <div className="stars">
                {[1, 2, 3].map((i) => (
                    <span key={i} className={`star ${i <= starCount ? 'filled' : ''}`}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="menu-screen">
            <div className="menu-content">
                {/* Header */}
                <div className="menu-header">
                    <h1 className="menu-title">Choose Your Challenge</h1>
                    <p className="menu-subtitle">Master IPA transcription through practice</p>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    {bestStreak > 0 && (
                        <div className="stat-badge">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-text">Best: {bestStreak}</span>
                        </div>
                    )}
                    <button
                        className="stat-badge clickable"
                        onClick={() => setShowAchievements(true)}
                    >
                        <span className="stat-icon">🏆</span>
                        <span className="stat-text">{achievementStats.unlocked}/{achievementStats.total}</span>
                    </button>
                    {dailyStreak > 0 && (
                        <div className="stat-badge">
                            <span className="stat-icon">📅</span>
                            <span className="stat-text">{dailyStreak} day streak</span>
                        </div>
                    )}
                </div>

                {/* Special Modes Section */}
                <div className="special-modes-section">
                    {/* Daily Challenge Card */}
                    <div
                        className={`special-mode-card daily ${dailyCompleted ? 'completed' : ''}`}
                        onClick={() => !dailyCompleted && onStartDailyChallenge?.()}
                    >
                        <div className="special-icon">📅</div>
                        <div className="special-info">
                            <h3>Daily Challenge</h3>
                            <p>{dailyInfo.theme}</p>
                            <span className="special-meta">
                                {dailyCompleted ? '✓ Completed' : `${dailyInfo.wordCount} words • ${dailyInfo.difficulty}`}
                            </span>
                        </div>
                        {!dailyCompleted && (
                            <button className="btn btn-primary special-btn">
                                Play
                            </button>
                        )}
                    </div>

                    {/* Timed Mode Card */}
                    <div
                        className="special-mode-card timed"
                        onClick={() => onStartTimedMode?.()}
                    >
                        <div className="special-icon">⏱️</div>
                        <div className="special-info">
                            <h3>Timed Mode</h3>
                            <p>60-second speed challenge</p>
                            <span className="special-meta">Race against the clock!</span>
                        </div>
                        <button className="btn btn-primary special-btn">
                            Start
                        </button>
                    </div>

                    {/* Learn Mode Card */}
                    <div
                        className="special-mode-card learn"
                        onClick={() => onOpenLearnMode?.()}
                    >
                        <div className="special-icon">📚</div>
                        <div className="special-info">
                            <h3>Learn Mode</h3>
                            <p>Symbol tutorials & minimal pairs</p>
                            <span className="special-meta">Study IPA fundamentals</span>
                        </div>
                        <button className="btn btn-secondary special-btn">
                            Learn
                        </button>
                    </div>
                </div>

                {/* Game Mode Selection */}
                <div className="mode-section">
                    <h2 className="section-title">Practice Modes</h2>
                    <div className="mode-cards">
                        <div className="mode-card">
                            <div className="mode-icon">📝</div>
                            <h3>Word → IPA</h3>
                            <p>See a word, choose its IPA transcription</p>
                            <div className="mode-example">
                                <span className="example-word">butter</span>
                                <span className="arrow">→</span>
                                <span className="example-ipa">/ˈbʌtɚ/</span>
                            </div>
                        </div>
                        <div className="mode-card">
                            <div className="mode-icon">🔤</div>
                            <h3>IPA → Word</h3>
                            <p>See IPA, choose the English word</p>
                            <div className="mode-example">
                                <span className="example-ipa">/ˈkæt/</span>
                                <span className="arrow">→</span>
                                <span className="example-word">cat</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Selection */}
                <div className="levels-section">
                    <h2 className="section-title">Difficulty Levels</h2>
                    <div className="levels-grid">
                        {levels.map(([levelKey, info], index) => {
                            const isUnlocked = unlockedLevels.includes(levelKey);
                            const progress = levelProgress[levelKey];
                            const progressPercent = progress.attempts > 0
                                ? Math.min(100, (progress.correct / info.requiredCorrect) * 100)
                                : 0;

                            return (
                                <div
                                    key={levelKey}
                                    className={`level-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                                    style={{ '--level-color': info.color }}
                                >
                                    <div className="level-header">
                                        <span className="level-number">Level {index + 1}</span>
                                        {renderStars(progress.stars)}
                                    </div>

                                    <h3 className="level-name">{info.name}</h3>
                                    <p className="level-description">{info.description}</p>

                                    {isUnlocked && (
                                        <div className="level-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                            <span className="progress-text">
                                                {progress.correct}/{info.requiredCorrect} correct
                                            </span>
                                        </div>
                                    )}

                                    {!isUnlocked && (
                                        <div className="locked-overlay">
                                            <span className="lock-icon">🔒</span>
                                            <span>Complete Level {index} to unlock</span>
                                        </div>
                                    )}

                                    {isUnlocked && (
                                        <div className="level-buttons">
                                            <button
                                                className="btn btn-primary level-btn"
                                                onClick={() => onStartGame('wordToIpa', levelKey)}
                                            >
                                                Word → IPA
                                            </button>
                                            <button
                                                className="btn btn-secondary level-btn"
                                                onClick={() => onStartGame('ipaToWord', levelKey)}
                                            >
                                                IPA → Word
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reset Progress */}
                <div className="reset-section">
                    <button
                        className="btn btn-ghost reset-btn"
                        onClick={() => {
                            if (confirm('Are you sure you want to reset all progress?')) {
                                onResetProgress();
                            }
                        }}
                    >
                        Reset Progress
                    </button>
                </div>
            </div>

            {/* Achievements Modal */}
            {showAchievements && (
                <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
                    <div className="modal-content achievements-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🏆 Achievements</h2>
                            <button className="close-btn" onClick={() => setShowAchievements(false)}>×</button>
                        </div>
                        <div className="achievement-stats">
                            <div className="achievement-stat">
                                <span className="achievement-stat-value">{achievementStats.unlocked}</span>
                                <span className="achievement-stat-label">Unlocked</span>
                            </div>
                            <div className="achievement-stat">
                                <span className="achievement-stat-value">{achievementStats.total}</span>
                                <span className="achievement-stat-label">Total</span>
                            </div>
                            <div className="achievement-stat">
                                <span className="achievement-stat-value">{achievementStats.percentage}%</span>
                                <span className="achievement-stat-label">Complete</span>
                            </div>
                        </div>
                        <div className="achievements-grid">
                            {achievements.map(achievement => (
                                <div
                                    key={achievement.id}
                                    className={`achievement-badge ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
                                    title={achievement.description}
                                >
                                    <span className="achievement-badge-icon">{achievement.icon}</span>
                                    <span className="achievement-badge-name">{achievement.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuScreen;

