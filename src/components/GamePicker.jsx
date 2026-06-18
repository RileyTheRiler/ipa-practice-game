import '../styles/gamePicker.css';

/**
 * Top-level chooser between the practice modes.
 */
export function GamePicker({ onPickLiveCaption }) {
    return (
        <div className="game-picker">
            <div className="game-picker-inner">
                <header className="game-picker-header">
                    <h1>Pick a Mode</h1>
                    <p>Practice the International Phonetic Alphabet.</p>
                </header>

                <div className="game-picker-cards">
                    <button className="game-picker-card livecaption" onClick={onPickLiveCaption}>
                        <div className="picker-emoji">🎙️</div>
                        <h2>Live IPA Captions</h2>
                        <p>Speak and watch your words transcribed into IPA in real time.</p>
                        <ul className="picker-points">
                            <li>Broad &amp; narrow transcription</li>
                            <li>Accents &amp; multiple languages</li>
                            <li>Click any word to edit by hand</li>
                        </ul>
                        <span className="picker-cta">Open Live Captions →</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GamePicker;
