// Non-violent "hangman" scenes. Each wrong guess advances the scene one step.
// Running out of guesses (wrongCount === MAX_WRONG) loses the round.
//
// Two kinds of scenes:
//   - 'parts'  : a set of 8 emoji "parts". One part vanishes per wrong guess
//                (parts[0] goes first). When all are gone, the lose state shows.
//   - 'mover'  : a single emoji travels toward a goal. Reaching it = lose.
//
// Every theme is tuned for exactly MAX_WRONG steps so difficulty is consistent
// no matter which scene is randomly chosen.

export const MAX_WRONG = 8;

// Lay 8 items out in two gentle rows (used by "collection" themes).
const clusterParts = (emojis, size = '2.6rem') => {
    const xs = [18, 39, 61, 82];
    return emojis.map((emoji, i) => ({
        emoji,
        x: xs[i % 4],
        y: i < 4 ? 40 : 66,
        size,
    }));
};

// Stack 8 items vertically (used by the sundae). Index 0 sits on top.
const stackParts = (items) =>
    items.map((item, i) => ({
        emoji: item.emoji,
        x: 50,
        y: 14 + i * 9,
        size: item.size || '2.4rem',
    }));

export const hangmanThemes = [
    {
        id: 'snowman',
        name: 'Melting Snowman',
        kind: 'parts',
        accent: '#7FD4FF',
        winTitle: 'Snowman saved! ⛄',
        loseTitle: 'It melted away…',
        loseEmoji: '💧',
        // Decorations melt first, then the body melts from the top down.
        parts: [
            { emoji: '🎩', x: 50, y: 14, size: '2.4rem' },
            { emoji: '🥕', x: 50, y: 33, size: '1.6rem' },
            { emoji: '👀', x: 50, y: 28, size: '1.5rem' },
            { emoji: '🌿', x: 28, y: 52, size: '2rem' },
            { emoji: '🌿', x: 72, y: 52, size: '2rem' },
            { emoji: '⚪', x: 50, y: 31, size: '3.4rem' },
            { emoji: '⚪', x: 50, y: 53, size: '4.6rem' },
            { emoji: '⚪', x: 50, y: 78, size: '5.8rem' },
        ],
    },
    {
        id: 'sundae',
        name: 'Disappearing Sundae',
        kind: 'parts',
        accent: '#FF9EC4',
        winTitle: 'Dessert rescued! 🍨',
        loseTitle: 'All gone…',
        loseEmoji: '🥣',
        parts: stackParts([
            { emoji: '🍒' },
            { emoji: '✨' },
            { emoji: '🍓' },
            { emoji: '🍫' },
            { emoji: '🍦', size: '2.8rem' },
            { emoji: '🍨', size: '2.8rem' },
            { emoji: '🍪' },
            { emoji: '🥣', size: '3rem' },
        ]),
    },
    {
        id: 'garden',
        name: 'Wilting Garden',
        kind: 'parts',
        accent: '#86E08A',
        winTitle: 'Garden in bloom! 🌷',
        loseTitle: 'The garden wilted…',
        loseEmoji: '🥀',
        parts: clusterParts(['🌸', '🌷', '🌻', '🌹', '🌺', '🌼', '💐', '🪻']),
    },
    {
        id: 'balloons',
        name: 'Floating Balloons',
        kind: 'parts',
        accent: '#FFD66B',
        winTitle: 'Balloons held on! 🎈',
        loseTitle: 'They all popped…',
        loseEmoji: '💥',
        parts: clusterParts(['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈']),
    },
    {
        id: 'candy',
        name: 'Vanishing Candy',
        kind: 'parts',
        accent: '#C9A6FF',
        winTitle: 'Sweets saved! 🍬',
        loseTitle: 'All eaten up…',
        loseEmoji: '😋',
        parts: clusterParts(['🍬', '🍭', '🧁', '🍩', '🍪', '🍰', '🍫', '🍡']),
    },
    {
        id: 'sandcastle',
        name: 'Sandcastle & Tide',
        kind: 'parts',
        accent: '#FFCF8A',
        winTitle: 'Castle stands! 🏰',
        loseTitle: 'Washed away…',
        loseEmoji: '🌊',
        parts: clusterParts(['🚩', '⭐', '🐚', '🌟', '🏰', '🏖️', '🏖️', '🏰']),
    },
    {
        id: 'rocket',
        name: 'Rocket Countdown',
        kind: 'mover',
        accent: '#9AB8FF',
        winTitle: 'Kept on the ground! 🚀',
        loseTitle: 'Blast off — it left!',
        loseEmoji: '🌌',
        mover: '🚀',
        trail: '💨',
        start: { emoji: '🌍', x: 50, y: 90, size: '2.4rem' },
        path: 'up', // travels from bottom to top
    },
    {
        id: 'turtle',
        name: 'Turtle Escape',
        kind: 'mover',
        accent: '#86E0C0',
        winTitle: 'Turtle stayed! 🐢',
        loseTitle: 'It reached the sea!',
        loseEmoji: '🌊',
        mover: '🐢',
        trail: '👣',
        goal: { emoji: '🏁', x: 90, y: 60, size: '2.2rem' },
        path: 'right', // travels left to right
    },
    {
        id: 'ufo',
        name: 'Alien Liftoff',
        kind: 'mover',
        accent: '#A6F0FF',
        winTitle: 'Visitor stayed! 👽',
        loseTitle: 'Beamed back up!',
        loseEmoji: '🌠',
        mover: '🛸',
        trail: '✨',
        start: { emoji: '👽', x: 50, y: 88, size: '2.2rem' },
        path: 'up',
    },
];

export const getRandomTheme = () =>
    hangmanThemes[Math.floor(Math.random() * hangmanThemes.length)];
