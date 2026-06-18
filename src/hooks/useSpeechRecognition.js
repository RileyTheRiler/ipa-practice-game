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

export function useSpeechRecognition({ lang = 'en-US' } = {}) {
    const supported = Boolean(SpeechRecognition);
    const [listening, setListening] = useState(false);
    const [finalText, setFinalText] = useState('');
    const [interimText, setInterimText] = useState('');
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);
    // Track whether the user intends to keep listening, so we can auto-restart
    // when the engine times out (it stops on its own after a pause).
    const keepAliveRef = useRef(false);
    // Transcript committed from previous (already-ended) recognition sessions.
    const committedRef = useRef('');
    // Finalized transcript from the *current* session. Recomputed from scratch
    // on every result event so a single segment can never be counted twice
    // (the source of the earlier word/phrase repetition bug).
    const sessionFinalRef = useRef('');

    // Lazily create and configure the recognition instance.
    const getRecognition = useCallback(() => {
        if (!supported) return null;
        if (recognitionRef.current) return recognitionRef.current;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            // Rebuild this session's transcript from the full results list each
            // time, rather than appending deltas. event.results is cumulative
            // for the session, so iterating from 0 yields each final segment
            // exactly once even if the engine re-fires or re-indexes results.
            let sessionFinal = '';
            let interim = '';
            for (let i = 0; i < event.results.length; i += 1) {
                const result = event.results[i];
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    sessionFinal += transcript;
                } else {
                    interim += transcript;
                }
            }
            sessionFinalRef.current = sessionFinal.trim();
            const combined = (committedRef.current + ' ' + sessionFinalRef.current).trim();
            setFinalText(combined);
            setInterimText(interim);
        };

        recognition.onerror = (event) => {
            // "no-speech" and "aborted" are routine; surface the rest.
            if (event.error && event.error !== 'no-speech' && event.error !== 'aborted') {
                setError(event.error);
            }
        };

        recognition.onend = () => {
            setInterimText('');
            // Commit this session's finalized text so the next session starts
            // with a fresh, empty results list.
            if (sessionFinalRef.current) {
                committedRef.current = (committedRef.current + ' ' + sessionFinalRef.current).trim();
                sessionFinalRef.current = '';
            }
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

    return { supported, listening, finalText, interimText, error, start, stop, reset };
}
