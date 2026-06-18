import '../styles/gamePicker.css';

/**
 * Top-level chooser between the practice modes.
 */
export function GamePicker({ onPickHangman, onPickQuiz, onPickLiveCaption }) {
    return (
        <div className="game-picker">
            <div className="game-picker-inner">
                <header className="game-picker-header">
                    <h1>Pick a Mode</h1>
                    <p>Three ways to practice the International Phonetic Alphabet.</p>
                </header>

                <div className="game-picker-cards">
                    <button className="game-picker-card hangman" onClick={onPickHangman}>
                        <div className="picker-emoji">⛄</div>
                        <h2>IPA Hangman</h2>
                        <p>Guess the hidden word or transcription one sound at a time.</p>
                        <ul className="picker-points">
                            <li>Word → IPA or IPA → Word</li>
                            <li>Friendly, non-violent scenes</li>
                            <li>Built-in IPA keyboard</li>
                        </ul>
                        <span className="picker-cta">Play Hangman →</span>
                    </button>

                    <button className="game-picker-card quiz" onClick={onPickQuiz}>
                        <div className="picker-emoji">📝</div>
                        <h2>IPA Quiz Practice</h2>
                        <p>Multiple-choice questions with detailed phoneme explanations.</p>
                        <ul className="picker-points">
                            <li>Word → IPA or IPA → Word</li>
                            <li>Five difficulty levels</li>
                            <li>Timed &amp; Learn modes</li>
                        </ul>
                        <span className="picker-cta">Start Quiz →</span>
                    </button>

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
