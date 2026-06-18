import { describe, it, expect } from 'vitest';
import { mergeTranscript } from './useSpeechRecognition';

describe('mergeTranscript', () => {
    it('appends when there is no overlap (engine reset on restart)', () => {
        expect(mergeTranscript('why', 'hello')).toBe('why hello');
    });

    it('does not duplicate a fully replayed session', () => {
        expect(mergeTranscript('why', 'why hello')).toBe('why hello');
        expect(mergeTranscript('why hello', 'why hello there')).toBe('why hello there');
    });

    it('reproduces the reported trace without duplication', () => {
        // Each new session replays prior finalized words then adds the new one.
        let committed = '';
        committed = mergeTranscript(committed, 'why');
        committed = mergeTranscript(committed, 'why hello');
        committed = mergeTranscript(committed, 'why hello there');
        expect(committed).toBe('why hello there');
    });

    it('removes a replayed tail overlap', () => {
        expect(mergeTranscript('hello there', 'there friend')).toBe('hello there friend');
    });

    it('is case-insensitive when detecting overlap', () => {
        expect(mergeTranscript('Why hello', 'why hello there')).toBe('Why hello there');
    });

    it('handles empty inputs', () => {
        expect(mergeTranscript('', 'why')).toBe('why');
        expect(mergeTranscript('why', '')).toBe('why');
        expect(mergeTranscript('', '')).toBe('');
    });

    it('keeps genuine repeats within a single session', () => {
        expect(mergeTranscript('', 'why why')).toBe('why why');
    });
});
