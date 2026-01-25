/**
 * Achievements System
 * Defines achievement criteria and unlock logic
 */

export const achievements = {
    // Streak achievements
    streak5: {
        id: 'streak5',
        name: 'On Fire!',
        description: 'Get 5 correct answers in a row',
        icon: '🔥',
        category: 'streak',
        requirement: 5,
        check: (state) => state.streak >= 5,
    },
    streak10: {
        id: 'streak10',
        name: 'Unstoppable',
        description: 'Get 10 correct answers in a row',
        icon: '💫',
        category: 'streak',
        requirement: 10,
        check: (state) => state.streak >= 10,
    },
    streak25: {
        id: 'streak25',
        name: 'Legendary Streak',
        description: 'Get 25 correct answers in a row',
        icon: '👑',
        category: 'streak',
        requirement: 25,
        check: (state) => state.streak >= 25,
    },

    // Speed achievements
    speedDemon: {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Answer 10 words correctly in under 60 seconds',
        icon: '⚡',
        category: 'speed',
        check: (state) => state.timedModeScore >= 10,
    },
    lightningFast: {
        id: 'lightningFast',
        name: 'Lightning Fast',
        description: 'Answer 20 words correctly in timed mode',
        icon: '🚀',
        category: 'speed',
        check: (state) => state.timedModeScore >= 20,
    },

    // Accuracy achievements
    perfectRound: {
        id: 'perfectRound',
        name: 'Perfect Round',
        description: 'Get 100% accuracy in a session (min 5 words)',
        icon: '💯',
        category: 'accuracy',
        check: (state) => state.correctAnswers >= 5 && state.wrongAnswers === 0,
    },
    sharpshooter: {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: 'Maintain 90%+ accuracy over 20 answers',
        icon: '🎯',
        category: 'accuracy',
        check: (state) => {
            const total = state.correctAnswers + state.wrongAnswers;
            return total >= 20 && (state.correctAnswers / total) >= 0.9;
        },
    },

    // Progress achievements
    levelUnlock2: {
        id: 'levelUnlock2',
        name: 'Moving Up',
        description: 'Unlock Level 2',
        icon: '⬆️',
        category: 'progress',
        check: (state) => state.unlockedLevels?.includes('level2'),
    },
    levelUnlock5: {
        id: 'levelUnlock5',
        name: 'Master Student',
        description: 'Unlock all 5 levels',
        icon: '🎓',
        category: 'progress',
        check: (state) => state.unlockedLevels?.length >= 5,
    },
    threeStars: {
        id: 'threeStars',
        name: 'Star Collector',
        description: 'Get 3 stars on any level',
        icon: '⭐',
        category: 'progress',
        check: (state) => Object.values(state.levelProgress || {}).some(l => l.stars >= 3),
    },
    allStars: {
        id: 'allStars',
        name: 'Perfect Scholar',
        description: 'Get 3 stars on all levels',
        icon: '🌟',
        category: 'progress',
        check: (state) => Object.values(state.levelProgress || {}).every(l => l.stars >= 3),
    },

    // Daily challenge achievements
    dailyComplete: {
        id: 'dailyComplete',
        name: 'Daily Devotee',
        description: 'Complete your first daily challenge',
        icon: '📅',
        category: 'daily',
        check: (state) => state.dailyChallengesCompleted >= 1,
    },
    dailyStreak7: {
        id: 'dailyStreak7',
        name: 'Week Warrior',
        description: 'Complete 7 daily challenges in a row',
        icon: '📆',
        category: 'daily',
        check: (state) => state.dailyStreak >= 7,
    },
    dailyStreak30: {
        id: 'dailyStreak30',
        name: 'Monthly Master',
        description: 'Complete 30 daily challenges in a row',
        icon: '🏆',
        category: 'daily',
        check: (state) => state.dailyStreak >= 30,
    },

    // Time-based achievements
    nightOwl: {
        id: 'nightOwl',
        name: 'Night Owl',
        description: 'Practice after 10 PM',
        icon: '🦉',
        category: 'time',
        check: () => new Date().getHours() >= 22,
    },
    earlyBird: {
        id: 'earlyBird',
        name: 'Early Bird',
        description: 'Practice before 7 AM',
        icon: '🐦',
        category: 'time',
        check: () => new Date().getHours() < 7,
    },

    // Score achievements
    centurion: {
        id: 'centurion',
        name: 'Centurion',
        description: 'Score 100 points in a single session',
        icon: '💪',
        category: 'score',
        check: (state) => state.score >= 100,
    },
    highScorer: {
        id: 'highScorer',
        name: 'High Scorer',
        description: 'Score 500 points in a single session',
        icon: '🏅',
        category: 'score',
        check: (state) => state.score >= 500,
    },

    // Total progress achievements
    dedicated: {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Answer 100 words total',
        icon: '📚',
        category: 'total',
        check: (state) => (state.totalCorrect || 0) + (state.totalWrong || 0) >= 100,
    },
    ipaExpert: {
        id: 'ipaExpert',
        name: 'IPA Expert',
        description: 'Answer 500 words correctly',
        icon: '🎖️',
        category: 'total',
        check: (state) => (state.totalCorrect || 0) >= 500,
    },
};

/**
 * Get list of unlocked achievements
 */
export function getUnlockedAchievements() {
    const unlocked = localStorage.getItem('ipa-achievements');
    return unlocked ? JSON.parse(unlocked) : [];
}

/**
 * Check for new achievements and return any newly unlocked ones
 */
export function checkAchievements(state) {
    const unlocked = getUnlockedAchievements();
    const newlyUnlocked = [];

    for (const achievement of Object.values(achievements)) {
        if (!unlocked.includes(achievement.id) && achievement.check(state)) {
            newlyUnlocked.push(achievement);
            unlocked.push(achievement.id);
        }
    }

    if (newlyUnlocked.length > 0) {
        localStorage.setItem('ipa-achievements', JSON.stringify(unlocked));
    }

    return newlyUnlocked;
}

/**
 * Get achievement by ID
 */
export function getAchievement(id) {
    return achievements[id] || null;
}

/**
 * Get all achievements with unlock status
 */
export function getAllAchievementsWithStatus() {
    const unlocked = getUnlockedAchievements();
    return Object.values(achievements).map(a => ({
        ...a,
        isUnlocked: unlocked.includes(a.id),
    }));
}

/**
 * Get achievement categories
 */
export function getAchievementCategories() {
    return [
        { id: 'streak', name: 'Streak', icon: '🔥' },
        { id: 'speed', name: 'Speed', icon: '⚡' },
        { id: 'accuracy', name: 'Accuracy', icon: '🎯' },
        { id: 'progress', name: 'Progress', icon: '📈' },
        { id: 'daily', name: 'Daily', icon: '📅' },
        { id: 'time', name: 'Time', icon: '⏰' },
        { id: 'score', name: 'Score', icon: '🏆' },
        { id: 'total', name: 'Total', icon: '📊' },
    ];
}

/**
 * Get achievement stats
 */
export function getAchievementStats() {
    const unlocked = getUnlockedAchievements();
    const total = Object.keys(achievements).length;
    return {
        unlocked: unlocked.length,
        total,
        percentage: Math.round((unlocked.length / total) * 100),
    };
}
