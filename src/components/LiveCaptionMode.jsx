import { useEffect, useMemo, useRef, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { transcribePhrase, getDictionarySize } from '../utils/g2p';
import '../styles/liveCaption.css';

/**
 * LiveCaptionMode
 * Real-time IPA closed-captioning of spoken word.
 *
 * Pipeline:
 *   1. Audio capture + ASR  -> Web Speech API (useSpeechRecognition)
 *   2. Grapheme-to-Phoneme  -> transcribePhrase() from utils/g2p
 *   3. IPA rendering        -> live caption overlay below
 */
export function LiveCaptionMode({ onBack }) {
    const [showText, setShowText] = useState(true);
    const { supported, listening, finalText, interimText, error, start, stop, reset } =
        useSpeechRecognition({ lang: 'en-US' });

    const captionRef = useRef(null);
    const dictSize = useMemo(() => getDictionarySize(), []);

    // Convert the live transcript (finalized + in-progress) into IPA tokens.
    const finalTokens = useMemo(() => transcribePhrase(finalText), [finalText]);
    const interimTokens = useMemo(() => transcribePhrase(interimText), [interimText]);

    // Keep the caption scrolled to the latest words.
    useEffect(() => {
        if (captionRef.current) {
            captionRef.current.scrollTop = captionRef.current.scrollHeight;
        }
    }, [finalText, interimText]);

    const handleClear = () => {
        reset();
    };

    const renderTokens = (tokens, interim = false) =>
        tokens.map((tok, idx) => {
            if (!tok.isWord) {
                return (
                    <span key={idx} className="caption-punct">
                        {tok.text}
                    </span>
                );
            }
            return (
                <span
                    key={idx}
                    className={`caption-word ${interim ? 'interim' : ''} source-${tok.source}`}
                    title={`${tok.text} → /${tok.ipa}/ (${tok.source === 'dictionary' ? 'dictionary' : 'estimated'})`}
                >
                    <span className="caption-ipa">{tok.ipa}</span>
                    {showText && <span className="caption-text">{tok.text}</span>}
                </span>
            );
        });

    return (
        <div className="live-caption-container">
            <header className="live-caption-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Menu
                </button>
                <h1 className="live-caption-title">🎙️ Live IPA Captions</h1>
            </header>

            {!supported && (
                <div className="live-caption-unsupported">
                    <p>
                        Your browser doesn't support the Web Speech API needed for live
                        captioning. Try Chrome, Edge, or another Chromium-based browser.
                    </p>
                </div>
            )}

            {supported && (
                <>
                    <p className="live-caption-subtitle">
                        Speak and watch your words transcribed into the International
                        Phonetic Alphabet in real time.
                    </p>

                    <div className="live-caption-controls">
                        {!listening ? (
                            <button className="btn btn-primary mic-btn" onClick={start}>
                                <span className="mic-icon">🎤</span> Start Listening
                            </button>
                        ) : (
                            <button className="btn btn-danger mic-btn listening" onClick={stop}>
                                <span className="mic-icon pulsing">⏺</span> Stop
                            </button>
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={handleClear}
                            disabled={!finalText && !interimText}
                        >
                            Clear
                        </button>
                        <label className="toggle-text">
                            <input
                                type="checkbox"
                                checked={showText}
                                onChange={(e) => setShowText(e.target.checked)}
                            />
                            Show words
                        </label>
                    </div>

                    {listening && (
                        <div className="listening-indicator">
                            <span className="listening-dot" /> Listening…
                        </div>
                    )}

                    {error && (
                        <div className="live-caption-error">
                            Microphone / recognition error: <code>{error}</code>
                            {error === 'not-allowed' && (
                                <span> — please allow microphone access and try again.</span>
                            )}
                        </div>
                    )}

                    <div className="caption-display" ref={captionRef}>
                        {finalTokens.length === 0 && interimTokens.length === 0 ? (
                            <p className="caption-placeholder">
                                {listening
                                    ? 'Start speaking…'
                                    : 'Press “Start Listening” and begin speaking.'}
                            </p>
                        ) : (
                            <p className="caption-line">
                                {renderTokens(finalTokens)}
                                {interimTokens.length > 0 && (
                                    <span className="interim-group">
                                        {' '}
                                        {renderTokens(interimTokens, true)}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="caption-legend">
                        <span className="legend-item">
                            <span className="legend-swatch source-dictionary" /> Dictionary
                            ({dictSize} words)
                        </span>
                        <span className="legend-item">
                            <span className="legend-swatch source-rules" /> Estimated (rule-based G2P)
                        </span>
                        <span className="legend-note">
                            Broad transcription • General American
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default LiveCaptionMode;
