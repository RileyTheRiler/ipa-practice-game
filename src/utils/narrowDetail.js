// Narrow (phonetic) transcription overlay.
//
// IMPORTANT — what this is and is NOT:
//   This takes a BROAD/phonemic IPA string (the output of g2p.js, i.e. the
//   canonical pronunciation of the *recognized word*) and applies the
//   well-established General American allophonic rules to predict a NARROW
//   [...] form. It is a rule-based PREDICTION of how the canonical word is
//   typically realized — it is NOT an acoustic analysis of what a given
//   speaker actually produced. For clinical work (speech sound disorders,
//   child speech) the actual production must be entered/corrected by hand
//   (see the manual edit layer in LiveCaptionMode).
//
// The rule set is kept in sync with the teaching material: the human-readable
// descriptions live in allophonicRules.processes, which we re-export so the UI
// and the transform share a single source of truth.

import { allophonicRules } from './allophonicRules';

// Re-exported so the UI can explain each narrow rule it applies.
export const NARROW_PROCESSES = allophonicRules.processes;

// Multi-character IPA units that must be treated as a single segment.
const MULTI = ['tʃ', 'dʒ', 'aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ'];

const VOWELS = new Set([
    'i', 'ɪ', 'e', 'ɛ', 'æ', 'ə', 'ʌ', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ɝ', 'ɚ',
    'aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ',
]);
const NASALS = new Set(['m', 'n', 'ŋ']);
const STRESS = new Set(['ˈ', 'ˌ']);

// Combining diacritics.
const ASPIRATION = 'ʰ';
const NASAL_TILDE = '̃'; // ◌̃
const SYLLABIC = '̩'; // ◌̩

const isStress = (s) => STRESS.has(s);
const isVowel = (s) => VOWELS.has(s.replace('ː', ''));

// Split a broad IPA string into ordered segments (consonants, vowels with an
// optional length mark, and stress marks).
function tokenize(ipa) {
    const segs = [];
    let i = 0;
    while (i < ipa.length) {
        let base = null;
        for (const m of MULTI) {
            if (ipa.startsWith(m, i)) {
                base = m;
                break;
            }
        }
        if (!base) base = ipa[i];
        i += base.length;
        if (ipa[i] === 'ː') {
            base += 'ː';
            i += 1;
        }
        segs.push(base);
    }
    return segs;
}

const DEFAULT_OPTIONS = {
    aspiration: true,
    flapping: true,
    nasalization: true,
    darkL: true,
    syllabic: true,
};

/**
 * Apply General American allophonic detail to a broad IPA string.
 * Returns the narrow string WITHOUT brackets (the caller adds [ ]).
 */
export function applyNarrowDetail(broadIpa, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    if (!broadIpa) return '';
    const segs = tokenize(broadIpa.replace(/[/[\]]/g, ''));

    const prevBase = (i) => {
        for (let j = i - 1; j >= 0; j -= 1) if (!isStress(segs[j])) return segs[j];
        return null;
    };
    const nextBase = (i) => {
        for (let j = i + 1; j < segs.length; j += 1) if (!isStress(segs[j])) return segs[j];
        return null;
    };
    const isWordInitial = (i) => {
        for (let j = i - 1; j >= 0; j -= 1) if (!isStress(segs[j])) return false;
        return true;
    };
    const precededByStress = (i) => i > 0 && isStress(segs[i - 1]);

    const out = [];
    for (let i = 0; i < segs.length; i += 1) {
        const seg = segs[i];
        if (isStress(seg)) {
            out.push(seg);
            continue;
        }
        const base = seg.replace('ː', '');
        const pv = prevBase(i);
        const nx = nextBase(i);

        // Flapping: intervocalic /t,d/ -> [ɾ]. Checked before aspiration.
        if (
            opts.flapping &&
            (base === 't' || base === 'd') &&
            pv && isVowel(pv) && nx && isVowel(nx) &&
            !isWordInitial(i)
        ) {
            out.push('ɾ');
            continue;
        }

        // Aspiration: /p,t,k/ in syllable-initial position (word-initial or
        // right after a stress mark), but not after /s/ (e.g. "stop").
        if (
            opts.aspiration &&
            (base === 'p' || base === 't' || base === 'k') &&
            (isWordInitial(i) || precededByStress(i)) &&
            pv !== 's'
        ) {
            out.push(base + ASPIRATION);
            continue;
        }

        // Dark /l/ in coda (an /l/ not immediately before a vowel).
        if (opts.darkL && base === 'l' && !(nx && isVowel(nx))) {
            out.push('ɫ');
            continue;
        }

        // Vowel nasalization before a nasal consonant.
        if (opts.nasalization && isVowel(base) && nx && NASALS.has(nx)) {
            out.push(seg + NASAL_TILDE);
            continue;
        }

        out.push(seg);
    }

    let result = out.join('');

    // Syllabic consonants: unstressed schwa + {l, dark l, n, m} -> [l̩ n̩ m̩].
    if (opts.syllabic) {
        result = result.replace(/ə([lɫnm])/g, (_, c) => c + SYLLABIC);
    }

    return result;
}

export default applyNarrowDetail;
