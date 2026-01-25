import '../styles/game.css';

export function ResultsScreen({
    score,
    correctAnswers,
    wrongAnswers,
    bestStreak,
    currentLevel,
    levelProgress,
    onPlayAgain,
    onBackToMenu,
}) {
    const totalAnswers = correctAnswers + wrongAnswers;
    const accuracy = totalAnswers > 0
        ? Math.round((correctAnswers / totalAnswers) * 100)
        : 0;

    const getGrade = () => {
        if (accuracy >= 90) return { grade: 'A', message: 'Outstanding!', color: '#2ECC71' };
        if (accuracy >= 80) return { grade: 'B', message: 'Great job!', color: '#3498DB' };
        if (accuracy >= 70) return { grade: 'C', message: 'Good effort!', color: '#F39C12' };
        if (accuracy >= 60) return { grade: 'D', message: 'Keep practicing!', color: '#E67E22' };
        return { grade: 'F', message: 'Don\'t give up!', color: '#E74C3C' };
    };

    const gradeInfo = getGrade();

    return (
        <div className="results-container">
            <div className="results-card">
                <h1 className="results-title">Session Complete!</h1>

                {/* Grade Circle */}
                <div
                    className="grade-circle"
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${gradeInfo.color}33, ${gradeInfo.color}11)`,
                        border: `3px solid ${gradeInfo.color}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)',
                    }}
                >
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: gradeInfo.color }}>
                        {gradeInfo.grade}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {accuracy}%
                    </span>
                </div>

                <p style={{
                    color: gradeInfo.color,
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    {gradeInfo.message}
                </p>

                {/* Stats Grid */}
                <div className="results-stats">
                    <div className="stat-card">
                        <div className="stat-value">{score}</div>
                        <div className="stat-label">Total Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{correctAnswers}</div>
                        <div className="stat-label">Correct</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{wrongAnswers}</div>
                        <div className="stat-label">Incorrect</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
                            🔥 {bestStreak}
                        </div>
                        <div className="stat-label">Best Streak</div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="results-buttons">
                    <button className="btn btn-primary" onClick={onPlayAgain}>
                        Play Again
                    </button>
                    <button className="btn btn-secondary" onClick={onBackToMenu}>
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ResultsScreen;
