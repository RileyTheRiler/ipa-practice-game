import { useState, useRef, useCallback, useEffect } from 'react';

// Thin wrapper around the Web Speech API (SpeechRecognition). This is the
// ASR / "audio capture + speech-to-text" stage of the live-captioning
// pipeline. It runs entirely in the browser, no server required.
//
// Returns:
//   supported     - whether the browser exposes SpeechRecognition
//   listening     - whether we are actively transcribing
//   finalText     - accumulated finalized transcript
//   interimText   - the current in-progress (not yet finalized) chunk
//   error         - last error string, if any
//   start/stop/reset - controls

const SpeechRecognition =
    typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

/**
 * Join a list of finalized result transcripts into one string, trimming each,
 * dropping empties, and collapsing a result that is identical (case-insensitive)
 * to the one immediately before it. Guarantees single-space separators so words
 * are never glued together, and removes the "said once, shown twice in a row"
 * artifact some engines produce by re-emitting the same final result.
 */
export function dedupeConsecutive(transcripts) {
    const out = [];
    for (const raw of transcripts) {
        const s = (raw || '').trim();
        if (!s) continue;
        if (out.length === 0 || out[out.length - 1].toLowerCase() !== s.toLowerCase()) {
            out.push(s);
        }
    }
    return out.join(' ');
}

/**
 * Merge already-committed transcript text with the current recognition
 * session's finalized text, removing any replayed overlap.
 *
 * Some mobile speech engines (Android Chrome) re-emit previously finalized
 * words at the START of each new recognition session after an auto-restart.
 * A naive `committed + session` concatenation double-counts those words,
 * producing the "said once, shown several times" bug. This merge finds the
 * largest run of words where the tail of `committed` equals the head of
 * `session` and appends only the non-overlapping remainder. Engines that
 * reset cleanly (no replay) simply have zero overlap and append normally.
 */
export function mergeTranscript(committed, session) {
    const a = committed ? committed.trim().split(/\s+/) : [];
    const b = session ? session.trim().split(/\s+/) : [];
    if (a.length === 0) return b.join(' ');
    if (b.length === 0) return a.join(' ');

    const maxK = Math.min(a.length, b.length);
    let overlap = 0;
    for (let k = maxK; k > 0; k -= 1) {
        const tail = a.slice(-k).join(' ').toLowerCase();
        const head = b.slice(0, k).join(' ').toLowerCase();
        if (tail === head) {
            overlap = k;
            break;
        }
    }
    return a.concat(b.slice(overlap)).join(' ');
}

export function useSpeechRecognition({ lang = 'en-US' } = {}) {
    const supported = Boolean(SpeechRecognition);
    const [listening, setListening] = useState(false);
    const [finalText, setFinalText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [error, setError] = useState(null);
    // Confidence (0–1) of the most recent finalized result. The Web Speech API
    // does not expose per-word confidence, only per-result, so this is a
    // coarse signal of how sure the recognizer was about the last chunk.
    const [confidence, setConfidence] = useState(null);

    const recognitionRef = useRef(null);
    // The user wants to keep listening: we recognize ONE utterance per session
    // (non-continuous) and auto-restart for the next one while this is true.
    const keepAliveRef = useRef(false);
    // Everything finalized from PREVIOUS utterances. Each utterance is its own
    // recognition session, so completed utterances accumulate here.
    const committedRef = useRef('');
    // The current utterance's finalized text, rebuilt from the session's results
    // on every event so repeated/replayed result events stay idempotent.
    const sessionFinalRef = useRef('');
    // Pending timer for re-arming the recognizer between utterances.
    const restartTimerRef = useRef(null);
    const langRef = useRef(lang);
    langRef.current = lang;

    // Build a brand-new recognition instance for every session (the initial
    // start() and every auto-restart in onend), rather than reusing one
    // forever. Reusing a single instance across multiple start() calls is a
    // known source of Chrome silently stopping emitting onresult events
    // after the first session while still reporting itself as listening —
    // i.e. the mic looks "on" but nothing further is ever transcribed.
    const createRecognition = useCallback(() => {
        if (!supported) return null;

        const recognition = new SpeechRecognition();
        // Non-continuous: recognize a single utterance per session, then stop.
        // Continuous mode on mobile (notably Android Chrome) keeps one ever-
        // growing results buffer that it replays and jumbles across phrases,
        // producing duplicated / interleaved words. Capturing one utterance at
        // a time and appending each cleanly is far more reliable; we re-arm the
        // recognizer in onend to keep an effectively continuous experience.
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = langRef.current;
        // Ask for several alternatives. The engine uses the extra hypotheses
        // to improve its top pick, which helps with accented / non-native
        // speech; we still display alternative[0] but track its confidence.
        recognition.maxAlternatives = 5;

        recognition.onresult = (event) => {
            // Rebuild this utterance from its results each event (idempotent),
            // instead of appending deltas. Collect each finalized result as its
            // own trimmed string so they can be joined with spaces (some engines
            // omit separators, which otherwise glues words like "howhow") and
            // de-duplicated (some engines emit the same final result twice).
            const finals = [];
            let interim = '';
            let lastConfidence = null;
            for (let i = 0; i < event.results.length; i += 1) {
                const result = event.results[i];
                // Defend against engines that occasionally emit a result with
                // no alternatives — without this guard an exception here
                // would abort the handler before finalText/interimText are
                // ever updated, with no visible error.
                const alt = result && result[0];
                if (!alt) continue;
                const transcript = alt.transcript || '';
                if (result.isFinal) {
                    finals.push(transcript);
                    if (typeof alt.confidence === 'number') {
                        lastConfidence = alt.confidence;
                    }
                } else {
                    interim += `${transcript} `;
                }
            }
            sessionFinalRef.current = dedupeConsecutive(finals);
            // Merge (not append) so words the engine replays at the start of a
            // restarted session are not duplicated.
            setFinalText(mergeTranscript(committedRef.current, sessionFinalRef.current));
            if (lastConfidence !== null) setConfidence(lastConfidence);
            setInterimText(interim.trim());
        };

        recognition.onerror = (event) => {
            // "no-speech" and "aborted" are routine; surface the rest.
            if (event.error && event.error !== 'no-speech' && event.error !== 'aborted') {
                setError(event.error);
            }
        };

        recognition.onend = () => {
            setInterimText('');
            // Commit this session's final text before the engine clears its
            // results list, then clear the per-session buffer so a duplicate
            // onend (or replay) can't commit the same text twice.
            committedRef.current = mergeTranscript(committedRef.current, sessionFinalRef.current);
            sessionFinalRef.current = '';
            // Re-arm for the next utterance if the user hasn't stopped. Defer
            // slightly: starting synchronously inside onend can throw
            // InvalidStateError before the engine has fully released, which
            // would silently end listening.
            if (keepAliveRef.current) {
                restartTimerRef.current = setTimeout(() => {
                    if (!keepAliveRef.current) return;
                    const next = createRecognition();
                    if (!next) return;
                    recognitionRef.current = next;
                    try {
                        next.start();
                    } catch {
                        // start() throws if already started; ignore.
                    }
                }, 150);
            } else {
                setListening(false);
            }
        };

        return recognition;
    }, [supported]);

    const start = useCallback(() => {
        const recognition = createRecognition();
        if (!recognition) return;
        recognitionRef.current = recognition;
        setError(null);
        keepAliveRef.current = true;
        try {
            recognition.start();
            setListening(true);
        } catch {
            // Already started — ignore.
        }
    }, [createRecognition]);

    const stop = useCallback(() => {
        keepAliveRef.current = false;
        if (restartTimerRef.current) {
            clearTimeout(restartTimerRef.current);
            restartTimerRef.current = null;
        }
        const recognition = recognitionRef.current;
        if (recognition) {
            try {
                recognition.stop();
            } catch {
                // Already stopped — ignore, but still reflect stopped state below.
            }
        }
        setListening(false);
        setInterimText('');
    }, []);

    const reset = useCallback(() => {
        committedRef.current = '';
        sessionFinalRef.current = '';
        setFinalText('');
        setInterimText('');
        setError(null);
        setConfidence(null);
    }, []);

    // Clean up on unmount.
    useEffect(() => {
        return () => {
            keepAliveRef.current = false;
            if (restartTimerRef.current) {
                clearTimeout(restartTimerRef.current);
                restartTimerRef.current = null;
            }
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {
                    // ignore
                }
            }
        };
    }, []);

    return { supported, listening, finalText, interimText, error, confidence, start, stop, reset };
}
