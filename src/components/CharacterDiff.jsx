import '../styles/characterDiff.css';

/**
 * CharacterDiff component
 * Visual display of character-by-character IPA comparison
 * Shows correct, wrong, missing, and extra characters with color coding
 */
export function CharacterDiff({ diff, showExplanations = true }) {
    if (!diff || diff.length === 0) {
        return null;
    }

    return (
        <div className="character-diff">
            <div className="diff-label">Character Analysis</div>
            <div className="diff-display">
                {diff.map((item, index) => (
                    <span
                        key={index}
                        className={`diff-char ${item.type}`}
                        title={getTooltip(item)}
                    >
                        {item.type === 'missing' ? (
                            <span className="missing-char">{item.expected}</span>
                        ) : (
                            item.char
                        )}
                        {item.type === 'wrong' && item.expected && (
                            <span className="expected-char">{item.expected}</span>
                        )}
                    </span>
                ))}
            </div>

            {showExplanations && (
                <div className="diff-legend">
                    <span className="legend-item correct">
                        <span className="legend-dot"></span>
                        Correct
                    </span>
                    <span className="legend-item wrong">
                        <span className="legend-dot"></span>
                        Wrong
                    </span>
                    <span className="legend-item missing">
                        <span className="legend-dot"></span>
                        Missing
                    </span>
                    <span className="legend-item extra">
                        <span className="legend-dot"></span>
                        Extra
                    </span>
                </div>
            )}
        </div>
    );
}

function getTooltip(item) {
    switch (item.type) {
        case 'correct':
            return `✓ Correct: ${item.char}`;
        case 'wrong':
            return `✗ You typed "${item.char}" but should be "${item.expected}"`;
        case 'missing':
            return `Missing: ${item.expected}`;
        case 'extra':
            return `Extra character: ${item.char}`;
        default:
            return '';
    }
}

export default CharacterDiff;
