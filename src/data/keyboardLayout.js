// IPA Keyboard Layout - Based on IPA-SIL layout from reference image

export const keyboardRows = [
    // Row 1 - Top row (mostly vowels and special consonants)
    [
        { symbol: 'ɑ', label: 'ɑ', type: 'vowel' },
        { symbol: 'ʍ', label: 'ʍ', type: 'consonant' },
        { symbol: 'ɛ', label: 'ɛ', type: 'vowel' },
        { symbol: 'ɾ', label: 'ɾ', type: 'consonant' },
        { symbol: 'θ', label: 'θ', type: 'consonant' },
        { symbol: 'ʊ', label: 'ʊ', type: 'vowel' },
        { symbol: 'ɪ', label: 'ɪ', type: 'vowel' },
        { symbol: 'ɔ', label: 'ɔ', type: 'vowel' },
        { symbol: 'œ', label: 'œ', type: 'vowel' },
        { symbol: 'ɒ', label: 'ɒ', type: 'vowel' },
        { symbol: 'ʔ', label: 'ʔ', type: 'consonant' },
    ],
    // Row 2 - Home row
    [
        { symbol: 'æ', label: 'æ', type: 'vowel' },
        { symbol: 'ʃ', label: 'ʃ', type: 'consonant' },
        { symbol: 'ð', label: 'ð', type: 'consonant' },
        { symbol: 'ʒ', label: 'ʒ', type: 'consonant' },
        { symbol: 'ɣ', label: 'ɣ', type: 'consonant' },
        { symbol: 'ɥ', label: 'ɥ', type: 'consonant' },
        { symbol: 'ɲ', label: 'ɲ', type: 'consonant' },
        { symbol: 'ŋ', label: 'ŋ', type: 'consonant' },
        { symbol: 'ɹ', label: 'ɹ', type: 'consonant' },
        { symbol: 'ʁ', label: 'ʁ', type: 'consonant' },
    ],
    // Row 3 - Bottom letter row
    [
        { symbol: 'ʌ', label: 'ʌ', type: 'vowel' },
        { symbol: 'ɕ', label: 'ɕ', type: 'consonant' },
        { symbol: 'ʤ', label: 'ʤ', type: 'consonant' },
        { symbol: 'ɟ', label: 'ɟ', type: 'consonant' },
        { symbol: 'ʝ', label: 'ʝ', type: 'consonant' },
        { symbol: 'ç', label: 'ç', type: 'consonant' },
        { symbol: 'ɫ', label: 'ɫ', type: 'consonant' },
        { symbol: 'ʎ', label: 'ʎ', type: 'consonant' },
        { symbol: 'ʐ', label: 'ʐ', type: 'consonant' },
        { symbol: 'ʑ', label: 'ʑ', type: 'consonant' },
    ],
    // Row 4 - Diacritics and special
    [
        { symbol: 'ˈ', label: 'ˈ', type: 'diacritic', name: 'stress' },
        { symbol: 'ˌ', label: 'ˌ', type: 'diacritic', name: 'secondary' },
        { symbol: 'ː', label: 'ː', type: 'diacritic', name: 'long' },
        { symbol: 'ə', label: 'ə', type: 'vowel' },
        { symbol: 'ɚ', label: 'ɚ', type: 'vowel' },
        { symbol: 'ɝ', label: 'ɝ', type: 'vowel' },
        { symbol: '.', label: '.', type: 'diacritic', name: 'syllable' },
    ],
];

// Alternate symbols for shift mode
export const shiftKeyboardRows = [
    // Row 1 shifted
    [
        { symbol: 'ɐ', label: 'ɐ', type: 'vowel' },
        { symbol: 'ɯ', label: 'ɯ', type: 'vowel' },
        { symbol: 'ɘ', label: 'ɘ', type: 'vowel' },
        { symbol: 'ɚ', label: 'ɚ', type: 'vowel' },
        { symbol: 'ɨ', label: 'ɨ', type: 'vowel' },
        { symbol: 'ɵ', label: 'ɵ', type: 'vowel' },
        { symbol: 'ɞ', label: 'ɞ', type: 'vowel' },
        { symbol: 'ə', label: 'ə', type: 'vowel' },
        { symbol: 'ʉ', label: 'ʉ', type: 'vowel' },
        { symbol: 'ɤ', label: 'ɤ', type: 'vowel' },
        { symbol: 'ʕ', label: 'ʕ', type: 'consonant' },
    ],
    // Row 2 shifted
    [
        { symbol: 'ä', label: 'ä', type: 'vowel' },
        { symbol: 'ʂ', label: 'ʂ', type: 'consonant' },
        { symbol: 'ɖ', label: 'ɖ', type: 'consonant' },
        { symbol: 'ʐ', label: 'ʐ', type: 'consonant' },
        { symbol: 'ɢ', label: 'ɢ', type: 'consonant' },
        { symbol: 'ħ', label: 'ħ', type: 'consonant' },
        { symbol: 'ɴ', label: 'ɴ', type: 'consonant' },
        { symbol: 'ɳ', label: 'ɳ', type: 'consonant' },
        { symbol: 'r', label: 'r', type: 'consonant' },
        { symbol: 'ʀ', label: 'ʀ', type: 'consonant' },
    ],
    // Row 3 shifted
    [
        { symbol: 'ɜ', label: 'ɜ', type: 'vowel' },
        { symbol: 'ʧ', label: 'ʧ', type: 'consonant' },
        { symbol: 'ɗ', label: 'ɗ', type: 'consonant' },
        { symbol: 'ʄ', label: 'ʄ', type: 'consonant' },
        { symbol: 'ʛ', label: 'ʛ', type: 'consonant' },
        { symbol: 'ɦ', label: 'ɦ', type: 'consonant' },
        { symbol: 'ɬ', label: 'ɬ', type: 'consonant' },
        { symbol: 'ɮ', label: 'ɮ', type: 'consonant' },
        { symbol: 'ʒ', label: 'ʒ', type: 'consonant' },
        { symbol: 'ʑ', label: 'ʑ', type: 'consonant' },
    ],
    // Row 4 shifted (same diacritics)
    [
        { symbol: 'ˈ', label: 'ˈ', type: 'diacritic', name: 'stress' },
        { symbol: 'ˌ', label: 'ˌ', type: 'diacritic', name: 'secondary' },
        { symbol: 'ː', label: 'ː', type: 'diacritic', name: 'long' },
        { symbol: 'ə', label: 'ə', type: 'vowel' },
        { symbol: 'ɚ', label: 'ɚ', type: 'vowel' },
        { symbol: 'ɝ', label: 'ɝ', type: 'vowel' },
        { symbol: '.', label: '.', type: 'diacritic', name: 'syllable' },
    ],
];

// Common Latin letters that appear in IPA (for convenience)
export const latinRow = [
    { symbol: 'a', label: 'a', type: 'vowel' },
    { symbol: 'e', label: 'e', type: 'vowel' },
    { symbol: 'i', label: 'i', type: 'vowel' },
    { symbol: 'o', label: 'o', type: 'vowel' },
    { symbol: 'u', label: 'u', type: 'vowel' },
    { symbol: 'p', label: 'p', type: 'consonant' },
    { symbol: 'b', label: 'b', type: 'consonant' },
    { symbol: 't', label: 't', type: 'consonant' },
    { symbol: 'd', label: 'd', type: 'consonant' },
    { symbol: 'k', label: 'k', type: 'consonant' },
    { symbol: 'ɡ', label: 'ɡ', type: 'consonant' },
];

export const latinRow2 = [
    { symbol: 'f', label: 'f', type: 'consonant' },
    { symbol: 'v', label: 'v', type: 'consonant' },
    { symbol: 's', label: 's', type: 'consonant' },
    { symbol: 'z', label: 'z', type: 'consonant' },
    { symbol: 'h', label: 'h', type: 'consonant' },
    { symbol: 'm', label: 'm', type: 'consonant' },
    { symbol: 'n', label: 'n', type: 'consonant' },
    { symbol: 'l', label: 'l', type: 'consonant' },
    { symbol: 'w', label: 'w', type: 'consonant' },
    { symbol: 'j', label: 'j', type: 'consonant' },
];
