import { useState, useCallback } from 'react';
import { keyboardRows, shiftKeyboardRows, latinRow, latinRow2 } from '../data/keyboardLayout';
import '../styles/keyboard.css';

export function IPAKeyboard({ onKeyPress, onBackspace, onClear }) {
    const [isShifted, setIsShifted] = useState(false);

    const handleKeyClick = useCallback((symbol, event) => {
        // Add pressed animation
        event.currentTarget.classList.add('pressed');
        setTimeout(() => {
            event.currentTarget.classList.remove('pressed');
        }, 150);

        onKeyPress(symbol);
    }, [onKeyPress]);

    const currentRows = isShifted ? shiftKeyboardRows : keyboardRows;

    return (
        <div className="keyboard-container">
            <div className="keyboard-wrapper">
                <div className="keyboard-header">
                    <span className="keyboard-title">IPA Keyboard</span>
                    <button
                        className={`shift-toggle ${isShifted ? 'active' : ''}`}
                        onClick={() => setIsShifted(!isShifted)}
                    >
                        ⇧ Shift
                    </button>
                </div>

                {/* Latin letters row (common in IPA) */}
                <div className="keyboard-section">
                    <div className="section-label">Common Letters</div>
                    <div className="keyboard-row">
                        {latinRow.map((key, idx) => (
                            <button
                                key={`latin1-${idx}`}
                                className={`key ${key.type}`}
                                onClick={(e) => handleKeyClick(key.symbol, e)}
                                title={key.symbol}
                            >
                                {key.label}
                            </button>
                        ))}
                    </div>
                    <div className="keyboard-row">
                        {latinRow2.map((key, idx) => (
                            <button
                                key={`latin2-${idx}`}
                                className={`key ${key.type}`}
                                onClick={(e) => handleKeyClick(key.symbol, e)}
                                title={key.symbol}
                            >
                                {key.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* IPA-specific symbols */}
                <div className="keyboard-section">
                    <div className="section-label">IPA Symbols {isShifted && '(Shifted)'}</div>
                    {currentRows.map((row, rowIdx) => (
                        <div key={`row-${rowIdx}`} className="keyboard-row">
                            {row.map((key, keyIdx) => (
                                <button
                                    key={`key-${rowIdx}-${keyIdx}`}
                                    className={`key ${key.type}`}
                                    onClick={(e) => handleKeyClick(key.symbol, e)}
                                    title={key.name || key.symbol}
                                >
                                    {key.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Control row */}
                <div className="keyboard-section">
                    <div className="keyboard-row">
                        <button
                            className="key special backspace"
                            onClick={onBackspace}
                        >
                            ← Backspace
                        </button>
                        <button
                            className="key special space"
                            onClick={(e) => handleKeyClick(' ', e)}
                        >
                            Space
                        </button>
                        <button
                            className="key special clear"
                            onClick={onClear}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="keyboard-legend">
                    <div className="legend-item">
                        <span className="legend-dot vowel"></span>
                        <span>Vowels</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot consonant"></span>
                        <span>Consonants</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot diacritic"></span>
                        <span>Diacritics</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IPAKeyboard;
