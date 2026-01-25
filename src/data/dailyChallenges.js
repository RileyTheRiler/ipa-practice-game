/**
 * Daily Challenges System
 * Generates consistent daily word sets using date-based seeding
 */

import { wordDatabase } from './wordDatabase';

/**
 * Simple seeded random number generator
 * Uses mulberry32 algorithm for consistency
 */
function seededRandom(seed) {
    return function () {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Get a numeric seed from a date string (YYYY-MM-DD)
 */
function getDateSeed(dateStr) {
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Get today's date as YYYY-MM-DD
 */
function getTodayString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Fisher-Yates shuffle with seeded random
 */
function seededShuffle(array, random) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get daily challenge words (10 curated words for today)
 */
export function getDailyChallengeWords() {
    const today = getTodayString();
    const seed = getDateSeed(today);
    const random = seededRandom(seed);

    // Combine all words from all levels
    const allWords = [
        ...wordDatabase.level1,
        ...wordDatabase.level2,
        ...wordDatabase.level3,
        ...wordDatabase.level4,
        ...wordDatabase.level5,
    ];

    // Shuffle and pick 10 words
    const shuffled = seededShuffle(allWords, random);
    return shuffled.slice(0, 10);
}

/**
 * Get daily challenge difficulty (varies by day of week)
 */
export function getDailyChallengeDifficulty() {
    const dayOfWeek = new Date().getDay();
    // Sunday = 0 is easiest, Saturday = 6 is hardest
    const difficulties = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Hard', 'Expert'];
    return difficulties[dayOfWeek];
}

/**
 * Get daily challenge info
 */
export function getDailyChallengeInfo() {
    const today = getTodayString();
    const words = getDailyChallengeWords();
    const difficulty = getDailyChallengeDifficulty();

    return {
        date: today,
        displayDate: new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        }),
        words,
        wordCount: words.length,
        difficulty,
        theme: getDailyTheme(),
    };
}

/**
 * Get a themed name for today's challenge
 */
function getDailyTheme() {
    const themes = [
        'Phonetic Puzzle',
        'Sound Safari',
        'IPA Adventure',
        'Vowel Voyage',
        'Consonant Quest',
        'Symbol Sprint',
        'Sound Scholar',
    ];
    const dayOfWeek = new Date().getDay();
    return themes[dayOfWeek];
}

/**
 * Check if daily challenge is completed
 */
export function isDailyChallengeCompleted() {
    const today = getTodayString();
    const completed = localStorage.getItem('ipa-daily-completed');
    return completed === today;
}

/**
 * Mark daily challenge as completed
 */
export function markDailyChallengeCompleted(score, perfectCount) {
    const today = getTodayString();
    const streak = getDailyStreak();

    localStorage.setItem('ipa-daily-completed', today);
    localStorage.setItem('ipa-daily-last-score', JSON.stringify({
        date: today,
        score,
        perfectCount,
        total: 10,
    }));

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const lastCompleted = localStorage.getItem('ipa-daily-streak-date');
    if (lastCompleted === yesterdayStr) {
        // Continue streak
        localStorage.setItem('ipa-daily-streak', String(streak + 1));
    } else if (lastCompleted !== today) {
        // Start new streak
        localStorage.setItem('ipa-daily-streak', '1');
    }
    localStorage.setItem('ipa-daily-streak-date', today);
}

/**
 * Get current daily streak
 */
export function getDailyStreak() {
    const streak = localStorage.getItem('ipa-daily-streak');
    return streak ? parseInt(streak, 10) : 0;
}

/**
 * Get last daily score
 */
export function getLastDailyScore() {
    const score = localStorage.getItem('ipa-daily-last-score');
    return score ? JSON.parse(score) : null;
}
