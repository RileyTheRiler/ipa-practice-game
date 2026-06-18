import './TitleScreen.css';

export function TitleScreen({ onStart }) {
    return (
        <div className="title-screen">
            <div className="title-content">
                {/* Decorative elements */}
                <div className="floating-symbols">
                    <span className="float-symbol s1">ɪ</span>
                    <span className="float-symbol s2">θ</span>
                    <span className="float-symbol s3">ə</span>
                    <span className="float-symbol s4">ŋ</span>
                    <span className="float-symbol s5">ʃ</span>
                    <span className="float-symbol s6">æ</span>
                </div>

                {/* Main title */}
                <div className="title-hero">
                    <h1 className="main-title">
                        <span className="title-ipa">/aɪ pɪ eɪ/</span>
                        <span className="title-text">IPA Practice</span>
                    </h1>
                    <p className="subtitle">
                        Master the International Phonetic Alphabet through interactive exercises
                    </p>
                </div>

                {/* Features */}
                <div className="features-grid">
                    <div className="feature-card animate-slideUp stagger-1">
                        <span className="feature-icon">🎹</span>
                        <h3>Virtual Keyboard</h3>
                        <p>Type IPA symbols with ease using our custom keyboard</p>
                    </div>
                    <div className="feature-card animate-slideUp stagger-2">
                        <span className="feature-icon">⛄</span>
                        <h3>IPA Hangman</h3>
                        <p>Guess words and transcriptions sound by sound</p>
                    </div>
                    <div className="feature-card animate-slideUp stagger-3">
                        <span className="feature-icon">📝</span>
                        <h3>Quiz Practice</h3>
                        <p>Multiple-choice drills with detailed explanations</p>
                    </div>
                </div>

                {/* Start button */}
                <button className="start-button" onClick={onStart}>
                    <span className="button-text">Start Learning</span>
                    <span className="button-arrow">→</span>
                </button>
            </div>
        </div>
    );
}

export default TitleScreen;
