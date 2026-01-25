/**
 * IPA Comparison Utilities
 * Character-by-character diff, partial scoring, and phonetic explanations
 */

import { ipaCategories } from '../data/ipaSymbols';

/**
 * Normalize IPA string for comparison
 * Handles common variations and alternate symbols
 */
export function normalizeIPA(ipa) {
    if (!ipa) return '';

    let normalized = ipa.trim().toLowerCase();

    // Common substitutions
    const substitutions = [
        [/ɝ/g, 'ɜɹ'],  // R-colored vowel
        [/ɚ/g, 'əɹ'],  // R-colored schwa
        [/ɹ/g, 'r'],   // Turned r to regular r
        [/ɡ/g, 'g'],   // IPA g to regular g
        [/ʔ/g, ''],    // Remove glottal stops (optional)
        [/ˈ/g, ''],    // Remove primary stress (optional for basic comparison)
        [/ˌ/g, ''],    // Remove secondary stress
        [/ː/g, ''],    // Remove length mark
        [/\./g, ''],   // Remove syllable breaks
    ];

    for (const [pattern, replacement] of substitutions) {
        normalized = normalized.replace(pattern, replacement);
    }

    return normalized;
}

/**
 * Compare two IPA strings character by character
 * Returns detailed diff information
 */
export function compareIPA(userAnswer, correctIPA) {
    const user = userAnswer.trim();
    const correct = correctIPA.trim();

    const normalizedUser = normalizeIPA(user);
    const normalizedCorrect = normalizeIPA(correct);

    // Check for exact match first
    if (normalizedUser === normalizedCorrect) {
        return {
            isExact: true,
            isClose: true,
            score: 100,
            diff: correct.split('').map(char => ({
                char,
                type: 'correct',
                expected: char,
            })),
        };
    }

    // Use Levenshtein-based diff
    const diff = [];
    const userChars = user.split('');
    const correctChars = correct.split('');

    // Simple character-by-character comparison with alignment
    const maxLen = Math.max(userChars.length, correctChars.length);

    let correctCount = 0;
    let userIndex = 0;
    let correctIndex = 0;

    while (userIndex < userChars.length || correctIndex < correctChars.length) {
        const userChar = userChars[userIndex];
        const correctChar = correctChars[correctIndex];

        if (userChar === correctChar) {
            diff.push({
                char: userChar,
                type: 'correct',
                expected: correctChar,
            });
            correctCount++;
            userIndex++;
            correctIndex++;
        } else if (correctIndex >= correctChars.length) {
            // Extra characters in user answer
            diff.push({
                char: userChar,
                type: 'extra',
                expected: null,
            });
            userIndex++;
        } else if (userIndex >= userChars.length) {
            // Missing characters
            diff.push({
                char: null,
                type: 'missing',
                expected: correctChar,
            });
            correctIndex++;
        } else {
            // Check if it's a substitution or misalignment
            const lookAheadUser = userChars.indexOf(correctChar, userIndex);
            const lookAheadCorrect = correctChars.indexOf(userChar, correctIndex);

            if (lookAheadUser !== -1 && lookAheadUser - userIndex <= 2) {
                // User has extra chars before the correct one
                diff.push({
                    char: userChar,
                    type: 'extra',
                    expected: null,
                });
                userIndex++;
            } else if (lookAheadCorrect !== -1 && lookAheadCorrect - correctIndex <= 2) {
                // User is missing some chars
                diff.push({
                    char: null,
                    type: 'missing',
                    expected: correctChar,
                });
                correctIndex++;
            } else {
                // Substitution
                diff.push({
                    char: userChar,
                    type: 'wrong',
                    expected: correctChar,
                });
                userIndex++;
                correctIndex++;
            }
        }
    }

    // Calculate score
    const score = Math.round((correctCount / Math.max(correctChars.length, 1)) * 100);

    return {
        isExact: false,
        isClose: score >= 70,
        score,
        diff,
        correctCount,
        totalExpected: correctChars.length,
    };
}

/**
 * Get partial credit score (0-100)
 */
export function getPartialScore(userAnswer, correctIPA) {
    const comparison = compareIPA(userAnswer, correctIPA);
    return comparison.score;
}

/**
 * Get phonetic explanation for a symbol
 */
export function getPhoneticExplanation(symbol) {
    // Search through ipaCategories for the symbol
    const explanations = {
        // Vowels
        'i': { name: 'Close front unrounded vowel', tip: 'Like the "ee" in "see". Keep your tongue high and forward.' },
        'ɪ': { name: 'Near-close front unrounded', tip: 'Like the "i" in "bit". Shorter than /i/.' },
        'e': { name: 'Close-mid front unrounded', tip: 'Like the "ay" in "day" (first part).' },
        'ɛ': { name: 'Open-mid front unrounded', tip: 'Like the "e" in "bed".' },
        'æ': { name: 'Near-open front unrounded', tip: 'Like the "a" in "cat". Open your mouth wider.' },
        'ə': { name: 'Schwa (mid central)', tip: 'The most common vowel! Like "a" in "about".' },
        'ʌ': { name: 'Open-mid back unrounded', tip: 'Like the "u" in "cup". More open than schwa.' },
        'ɜ': { name: 'Open-mid central unrounded', tip: 'Like British "ir" in "bird".' },
        'ɚ': { name: 'R-colored schwa', tip: 'American "er" in "butter".' },
        'ɝ': { name: 'R-colored open-mid central', tip: 'American "ir" in "bird".' },
        'u': { name: 'Close back rounded', tip: 'Like "oo" in "boot". Round your lips.' },
        'ʊ': { name: 'Near-close back rounded', tip: 'Like "oo" in "book". Shorter than /u/.' },
        'o': { name: 'Close-mid back rounded', tip: 'First part of "oh" in "go".' },
        'ɔ': { name: 'Open-mid back rounded', tip: 'Like "aw" in "thought" or "bought".' },
        'ɑ': { name: 'Open back unrounded', tip: 'Like "a" in "father". Open and back.' },

        // Consonants
        'θ': { name: 'Voiceless dental fricative', tip: 'Like "th" in "think". Put tongue between teeth, no voice.' },
        'ð': { name: 'Voiced dental fricative', tip: 'Like "th" in "this". Same position as /θ/ but with voice.' },
        'ʃ': { name: 'Voiceless postalveolar fricative', tip: 'Like "sh" in "ship".' },
        'ʒ': { name: 'Voiced postalveolar fricative', tip: 'Like "s" in "measure" or "vision".' },
        'ŋ': { name: 'Voiced velar nasal', tip: 'Like "ng" in "sing". No "g" sound at the end!' },
        'ɹ': { name: 'Voiced alveolar approximant', tip: 'American "r" in "red".' },
        'tʃ': { name: 'Voiceless postalveolar affricate', tip: 'Like "ch" in "church".' },
        'dʒ': { name: 'Voiced postalveolar affricate', tip: 'Like "j" in "judge".' },

        // Diacritics
        'ˈ': { name: 'Primary stress', tip: 'The following syllable is stressed (said louder/longer).' },
        'ˌ': { name: 'Secondary stress', tip: 'Less prominent stress than primary.' },
    };

    return explanations[symbol] || {
        name: 'IPA Symbol',
        tip: 'This is a phonetic symbol representing a specific sound.'
    };
}

/**
 * Get feedback message based on comparison result
 */
export function getFeedbackMessage(comparison) {
    if (comparison.isExact) {
        return {
            type: 'correct',
            message: 'Perfect!',
            detail: null
        };
    }

    if (comparison.score >= 90) {
        return {
            type: 'close',
            message: 'So close!',
            detail: 'You got most of it right.'
        };
    }

    if (comparison.score >= 70) {
        return {
            type: 'close',
            message: 'Almost right!',
            detail: 'Good effort, but check the highlighted symbols.'
        };
    }

    if (comparison.score >= 50) {
        return {
            type: 'partial',
            message: 'Getting there!',
            detail: 'You got about half right. Keep practicing!'
        };
    }

    return {
        type: 'incorrect',
        message: 'Not quite...',
        detail: 'Compare your answer with the correct IPA.'
    };
}

/**
 * Generate explanation for why specific symbols were wrong
 */
export function getWrongSymbolExplanations(diff) {
    const explanations = [];

    for (const item of diff) {
        if (item.type === 'wrong' && item.expected) {
            const correctExplanation = getPhoneticExplanation(item.expected);
            const userExplanation = getPhoneticExplanation(item.char);

            explanations.push({
                userSymbol: item.char,
                expectedSymbol: item.expected,
                explanation: `You used /${item.char}/ (${userExplanation.name}) but the correct sound is /${item.expected}/ (${correctExplanation.name}).`,
                tip: correctExplanation.tip,
            });
        }
    }

    return explanations;
}
