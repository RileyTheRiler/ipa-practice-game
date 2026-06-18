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
    // Track whether the user intends to keep listening, so we can auto-restart
    // when the engine times out (it stops on its own after a pause).
    const keepAliveRef = useRef(false);
    // Final text committed from PRIOR recognition sessions (i.e. everything from
    // before the most recent auto-restart). The engine resets its results list
    // on each restart, so we accumulate finalized text here across restarts.
    const committedRef = useRef('');
    // Final text for the CURRENT session. We rebuild this from the full results
    // list on every result event rather than appending deltas — some mobile
    // engines (notably Android Chrome) replay already-finalized results with a
    // stale resultIndex, and delta-appending turns those replays into duplicated
    // phrases. Rebuilding from scratch makes repeated events idempotent.
    const sessionFinalRef = useRef('');

    // Lazily create and configure the recognition instance.
    const getRecognition = useCallback(() => {
        if (!supported) return null;
        if (recognitionRef.current) return recognitionRef.current;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;
        // Ask for several alternatives. The engine uses the extra hypotheses
        // to improve its top pick, which helps with accented / non-native
        // speech; we still display alternative[0] but track its confidence.
        recognition.maxAlternatives = 5;

        recognition.onresult = (event) => {
            // Rebuild the whole session from the cumulative results list each
            // time (idempotent), instead of appending only new results. Collect
            // each finalized result as its own trimmed string so they can be
            // joined with spaces (some engines omit separators, which otherwise
            // glues words like "howhow") and de-duplicated (some engines emit
            // the same final result twice in a row).
            const finals = [];
            let interim = '';
            let lastConfidence = null;
            for (let i = 0; i < event.results.length; i += 1) {
                const result = event.results[i];
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    finals.push(transcript);
                    if (typeof result[0].confidence === 'number') {
                        lastConfidence = result[0].confidence;
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
            // Auto-restart if the user hasn't explicitly stopped.
            if (keepAliveRef.current) {
                try {
                    recognition.start();
                } catch {
                    // start() throws if already started; ignore.
                }
            } else {
                setListening(false);
            }
        };

        recognitionRef.current = recognition;
        return recognition;
    }, [supported, lang]);

    const start = useCallback(() => {
        const recognition = getRecognition();
        if (!recognition) return;
        setError(null);
        keepAliveRef.current = true;
        try {
            recognition.start();
            setListening(true);
        } catch {
            // Already started — ignore.
        }
    }, [getRecognition]);

    const stop = useCallback(() => {
        keepAliveRef.current = false;
        const recognition = recognitionRef.current;
        if (recognition) recognition.stop();
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

    // Update language on the live instance if it changes.
    useEffect(() => {
        if (recognitionRef.current) recognitionRef.current.lang = lang;
    }, [lang]);

    // Clean up on unmount.
    useEffect(() => {
        return () => {
            keepAliveRef.current = false;
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
