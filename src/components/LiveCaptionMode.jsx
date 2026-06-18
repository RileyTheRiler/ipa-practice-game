import { useEffect, useMemo, useRef, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { transcribePhrase, getDictionarySize } from '../utils/g2p';
import { applyNarrowDetail } from '../utils/narrowDetail';
import { accents, getAccent } from '../data/accents';
import { IPAKeyboard } from './IPAKeyboard';
import '../styles/liveCaption.css';

/**
 * LiveCaptionMode
 * Real-time IPA closed-captioning of spoken word.
 *
 * Pipeline:
 *   1. Audio capture + ASR  -> Web Speech API (useSpeechRecognition)
 *   2. Grapheme-to-Phoneme  -> transcribePhrase() from utils/g2p
 *   3. Accent + narrow-detail post-processing (this file)
 *   4. IPA rendering        -> live caption overlay below
 *
 * IMPORTANT: the IPA reflects the *canonical/predicted* pronunciation of the
 * word the recognizer detected — NOT the speaker's actual production. For
 * clinical use, correct any word by hand via the click-to-edit layer.
 */

const LANGUAGES = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'es-ES', label: 'Español' },
];

export function LiveCaptionMode({ onBack }) {
    const [showText, setShowText] = useState(true);
    const [mode, setMode] = useState('broad'); // 'broad' | 'narrow'
    const [accentId, setAccentId] = useState('ga');
    const [langCode, setLangCode] = useState('en-US');
    const [overrides, setOverrides] = useState({}); // word(lowercase) -> manual IPA
    const [editing, setEditing] = useState(null); // { text, draft }

    const { supported, listening, finalText, interimText, error, confidence, start, stop, reset } =
        useSpeechRecognition({ lang: langCode });

    const captionRef = useRef(null);
    const isEnglish = langCode.startsWith('en');
    const accent = getAccent(accentId);
    const dictSize = useMemo(() => getDictionarySize(langCode), [langCode]);

    // Narrow detail uses General American allophonic rules, so it only applies
    // to GA English. For other accents/languages, "narrow" only changes the
    // delimiters (it still shows the accent-appropriate broad form).
    const narrowApplies = mode === 'narrow' && isEnglish && accentId === 'ga';
    const [open, close] = mode === 'narrow' ? ['[', ']'] : ['/', '/'];

    const finalTokens = useMemo(
        () => transcribePhrase(finalText, langCode),
        [finalText, langCode],
    );
    const interimTokens = useMemo(
        () => transcribePhrase(interimText, langCode),
        [interimText, langCode],
    );

    // Compute the IPA actually displayed for a word token, applying (in order):
    // manual override > accent transform > narrow detail.
    const displayFor = (tok) => {
        const key = tok.text.toLowerCase();
        if (overrides[key] !== undefined) {
            return { ipa: overrides[key], source: 'manual' };
        }
        let ipa = tok.ipa;
        if (isEnglish) ipa = accent.transform(ipa);
        if (narrowApplies) ipa = applyNarrowDetail(ipa);
        return { ipa, source: tok.source };
    };

    // Keep the caption scrolled to the latest words.
    useEffect(() => {
        if (captionRef.current) {
            captionRef.current.scrollTop = captionRef.current.scrollHeight;
        }
    }, [finalText, interimText]);

    const handleClear = () => {
        reset();
        setOverrides({});
        setEditing(null);
    };

    const openEditor = (tok) => {
        const { ipa } = displayFor(tok);
        setEditing({ text: tok.text, draft: ipa });
    };

    const saveEdit = () => {
        if (!editing) return;
        setOverrides((prev) => ({ ...prev, [editing.text.toLowerCase()]: editing.draft }));
        setEditing(null);
    };

    const clearOverride = () => {
        if (!editing) return;
        setOverrides((prev) => {
            const next = { ...prev };
            delete next[editing.text.toLowerCase()];
            return next;
        });
        setEditing(null);
    };

    const buildExport = () =>
        finalTokens
            .filter((t) => t.isWord)
            .map((t) => `${t.text} → ${open}${displayFor(t).ipa}${close}`)
            .join('\n');

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(buildExport());
        } catch {
            // Clipboard may be unavailable; the download button is the fallback.
        }
    };

    const handleDownload = () => {
        const blob = new Blob([buildExport()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ipa-transcript.txt';
        a.click();
        URL.revokeObjectURL(url);
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
            const { ipa, source } = displayFor(tok);
            return (
                <button
                    type="button"
                    key={idx}
                    className={`caption-word ${interim ? 'interim' : ''} source-${source}`}
                    title={`${tok.text} → ${open}${ipa}${close} (${
                        source === 'dictionary'
                            ? 'dictionary'
                            : source === 'manual'
                              ? 'manually edited'
                              : 'estimated'
                    }) — click to edit`}
                    onClick={() => !interim && openEditor(tok)}
                    disabled={interim}
                >
                    <span className="caption-ipa">{ipa}</span>
                    {showText && <span className="caption-text">{tok.text}</span>}
                </button>
            );
        });

    const hasContent = finalTokens.length > 0 || interimTokens.length > 0;

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

                    <div className="live-caption-disclaimer">
                        ⚠️ The IPA shown is the <strong>predicted</strong> pronunciation of
                        the word the recognizer detected — not an analysis of the speaker's
                        actual production. For speech-sound-disorder or child speech work,
                        click any word to correct it to what was really said.
                    </div>

                    <div className="live-caption-options">
                        <label className="lc-option">
                            <span>Language</span>
                            <select
                                value={langCode}
                                onChange={(e) => {
                                    setLangCode(e.target.value);
                                    if (!e.target.value.startsWith('en')) setAccentId('ga');
                                }}
                            >
                                {LANGUAGES.map((l) => (
                                    <option key={l.code} value={l.code}>
                                        {l.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="lc-option">
                            <span>Accent</span>
                            <select
                                value={accentId}
                                onChange={(e) => setAccentId(e.target.value)}
                                disabled={!isEnglish}
                            >
                                {accents.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className="lc-option lc-mode">
                            <span>Transcription</span>
                            <div className="lc-segmented">
                                <button
                                    className={mode === 'broad' ? 'active' : ''}
                                    onClick={() => setMode('broad')}
                                >
                                    Broad /…/
                                </button>
                                <button
                                    className={mode === 'narrow' ? 'active' : ''}
                                    onClick={() => setMode('narrow')}
                                >
                                    Narrow […]
                                </button>
                            </div>
                        </div>
                    </div>

                    {mode === 'narrow' && !narrowApplies && (
                        <div className="lc-note">
                            Auto narrow detail (aspiration, flapping, nasalization…) is only
                            available for General American. Showing the accent/language broad
                            form in […]; edit words by hand for precise narrow detail.
                        </div>
                    )}

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
                        <button className="btn btn-secondary" onClick={handleClear} disabled={!hasContent}>
                            Clear
                        </button>
                        <button className="btn btn-secondary" onClick={handleCopy} disabled={!hasContent}>
                            Copy
                        </button>
                        <button className="btn btn-secondary" onClick={handleDownload} disabled={!hasContent}>
                            Export
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
                            {typeof confidence === 'number' && (
                                <span
                                    className={`confidence-pill ${confidence < 0.6 ? 'low' : 'ok'}`}
                                    title="Recognizer confidence in the last phrase"
                                >
                                    {Math.round(confidence * 100)}% sure
                                </span>
                            )}
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
                        {!hasContent ? (
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

                    {editing && (
                        <div className="lc-editor">
                            <div className="lc-editor-head">
                                <span>
                                    Editing <strong>{editing.text}</strong>:{' '}
                                    <span className="lc-editor-ipa">
                                        {open}
                                        {editing.draft}
                                        {close}
                                    </span>
                                </span>
                                <div className="lc-editor-actions">
                                    <button className="btn btn-primary" onClick={saveEdit}>
                                        Save
                                    </button>
                                    {overrides[editing.text.toLowerCase()] !== undefined && (
                                        <button className="btn btn-secondary" onClick={clearOverride}>
                                            Reset
                                        </button>
                                    )}
                                    <button className="btn btn-secondary" onClick={() => setEditing(null)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            <IPAKeyboard
                                onKeyPress={(sym) =>
                                    setEditing((e) => ({ ...e, draft: e.draft + sym }))
                                }
                                onBackspace={() =>
                                    setEditing((e) => ({ ...e, draft: e.draft.slice(0, -1) }))
                                }
                                onClear={() => setEditing((e) => ({ ...e, draft: '' }))}
                            />
                        </div>
                    )}

                    <div className="caption-legend">
                        <span className="legend-item">
                            <span className="legend-swatch source-dictionary" /> Dictionary
                            ({dictSize} words)
                        </span>
                        <span className="legend-item">
                            <span className="legend-swatch source-rules" /> Estimated (rule-based G2P)
                        </span>
                        <span className="legend-item">
                            <span className="legend-swatch source-manual" /> Manually edited
                        </span>
                        <span className="legend-note">
                            {mode === 'narrow' ? 'Narrow […]' : 'Broad /…/'} •{' '}
                            {isEnglish ? accent.label : LANGUAGES.find((l) => l.code === langCode)?.label}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default LiveCaptionMode;
