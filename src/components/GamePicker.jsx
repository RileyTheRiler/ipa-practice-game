import '../styles/gamePicker.css';

/**
 * Top-level chooser between the two games.
 */
export function GamePicker({ onPickHangman, onPickQuiz }) {
    return (
        <div className="game-picker">
            <div className="game-picker-inner">
                <header className="game-picker-header">
                    <h1>Pick a Game</h1>
                    <p>Two ways to practice the International Phonetic Alphabet.</p>
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
                </div>
            </div>
        </div>
    );
}

export default GamePicker;
