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
    // Confidence (0–1) of the most recent finalized result. The Web Speech API
    // does not expose per-word confidence, only per-result, so this is a
    // coarse signal of how sure the recognizer was about the last chunk.
    const [confidence, setConfidence] = useState(null);

    const recognitionRef = useRef(null);
    // Track whether the user intends to keep listening, so we can auto-restart
    // when the engine times out (it stops on its own after a pause).
    const keepAliveRef = useRef(false);

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
            let interim = '';
            let finalized = '';
            let lastConfidence = null;
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                const result = event.results[i];
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    finalized += transcript;
                    if (typeof result[0].confidence === 'number') {
                        lastConfidence = result[0].confidence;
                    }
                } else {
                    interim += transcript;
                }
            }
            if (finalized) {
                setFinalText((prev) => (prev + ' ' + finalized.trim()).trim());
                if (lastConfidence !== null) setConfidence(lastConfidence);
            }
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
