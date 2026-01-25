import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for Web Speech API text-to-speech functionality
 * Provides pronunciation audio for words in the IPA practice game
 */
export function useSpeechSynthesis() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    // Check for browser support and load voices
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            setIsSupported(true);

            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                setVoices(availableVoices);
                
                // Prefer English (US) voices
                const preferredVoice = availableVoices.find(
                    voice => voice.lang === 'en-US' && voice.name.includes('Female')
                ) || availableVoices.find(
                    voice => voice.lang === 'en-US'
                ) || availableVoices.find(
                    voice => voice.lang.startsWith('en')
                ) || availableVoices[0];
                
                setSelectedVoice(preferredVoice);
            };

            // Voices may load asynchronously
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;

            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
    }, []);

    // Speak the given text
    const speak = useCallback((text, options = {}) => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure utterance
        utterance.voice = selectedVoice;
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [isSupported, selectedVoice]);

    // Stop current speech
    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [isSupported]);

    return {
        speak,
        stop,
        isSpeaking,
        isSupported,
        voices,
        selectedVoice,
        setSelectedVoice,
    };
}

export default useSpeechSynthesis;
