import { describe, it, expect } from 'vitest';
import { applyNarrowDetail } from './narrowDetail';
import { getAccent } from '../data/accents';
import { transcribeWord } from './g2p';

describe('applyNarrowDetail (General American allophonic detail)', () => {
    const cases = [
        ['ˈbʌtɚ', 'ˈbʌɾɚ'], // flapping
        ['tɑp', 'tʰɑp'], // word-initial aspiration
        ['stɑp', 'stɑp'], // no aspiration after /s/
        ['pɪn', 'pʰɪ̃n'], // aspiration + nasalization
        ['mɪlk', 'mɪɫk'], // dark l in coda
        ['ˈbɑtəl', 'ˈbɑɾɫ̩'], // flap + syllabic dark l
        ['kæn', 'kʰæ̃n'], // aspiration + nasalization
    ];
    it.each(cases)('%s -> %s', (broad, narrow) => {
        expect(applyNarrowDetail(broad)).toBe(narrow);
    });

    it('returns empty for empty input', () => {
        expect(applyNarrowDetail('')).toBe('');
    });
});

describe('accent transforms', () => {
    const rp = getAccent('rp');
    it('makes RP non-rhotic in coda', () => {
        expect(rp.transform('kɑɹ')).toBe('kɑː'); // car
        expect(rp.transform('bɝd')).toBe('bɜːd'); // bird
        expect(rp.transform('ˈbʌtɚ')).toBe('ˈbʌtə'); // butter
    });
    it('keeps intervocalic (linking) /ɹ/', () => {
        expect(rp.transform('ˈvɛɹi')).toBe('ˈvɛɹi'); // very
    });
    it('applies LOT unrounding', () => {
        expect(rp.transform('hɑt')).toBe('hɒt'); // hot
    });
    it('GA is identity', () => {
        expect(getAccent('ga').transform('kɑɹ')).toBe('kɑɹ');
    });
});

describe('Spanish G2P provider', () => {
    it.each([
        ['gato', 'ɡato'],
        ['cielo', 'sielo'],
        ['jamón', 'xamon'],
        ['queso', 'keso'],
        ['rojo', 'roxo'], // word-initial trill
    ])('%s -> %s', (word, ipa) => {
        expect(transcribeWord(word, 'es').ipa).toBe(ipa);
    });
});
