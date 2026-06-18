// Word Database with IPA transcriptions (General American English)
// Organized by difficulty level

export const wordDatabase = {
    // Level 1: Simple CVC words with basic consonants and short vowels
    level1: [
        { word: 'cat', ipa: 'kæt', hint: 'Short a sound' },
        { word: 'dog', ipa: 'dɔɡ', hint: 'Open o sound' },
        { word: 'sit', ipa: 'sɪt', hint: 'Short i sound' },
        { word: 'pen', ipa: 'pɛn', hint: 'Short e sound' },
        { word: 'cup', ipa: 'kʌp', hint: 'Schwa-like u' },
        { word: 'but', ipa: 'bʌt', hint: 'Unstressed vowel' },
        { word: 'hot', ipa: 'hɑt', hint: 'Open back vowel' },
        { word: 'bed', ipa: 'bɛd', hint: 'Open e sound' },
        { word: 'run', ipa: 'ɹʌn', hint: 'American r' },
        { word: 'sun', ipa: 'sʌn', hint: 'Short u sound' },
        { word: 'map', ipa: 'mæp', hint: 'Short a' },
        { word: 'top', ipa: 'tɑp', hint: 'Open back vowel' },
        { word: 'pet', ipa: 'pɛt', hint: 'Short e' },
        { word: 'big', ipa: 'bɪɡ', hint: 'Short i' },
        { word: 'mom', ipa: 'mɑm', hint: 'Open back vowel' },
        { word: 'dad', ipa: 'dæd', hint: 'Short a' },
        { word: 'job', ipa: 'dʒɑb', hint: 'J sound is affricate' },
        { word: 'leg', ipa: 'lɛɡ', hint: 'Short e' },
        { word: 'hit', ipa: 'hɪt', hint: 'Short i' },
        { word: 'fox', ipa: 'fɑks', hint: 'X is two sounds' },
        { word: 'bag', ipa: 'bæɡ', hint: 'Short a sound' },
        { word: 'wet', ipa: 'wɛt', hint: 'Short e sound' },
        { word: 'box', ipa: 'bɑks', hint: 'X = ks' },
        { word: 'bus', ipa: 'bʌs', hint: 'Short u sound' },
        { word: 'lid', ipa: 'lɪd', hint: 'Short i sound' },
        { word: 'rug', ipa: 'ɹʌɡ', hint: 'Short u sound' },
        { word: 'log', ipa: 'lɔɡ', hint: 'Open o sound' },
        { word: 'zip', ipa: 'zɪp', hint: 'Voiced z sound' },
        { word: 'van', ipa: 'væn', hint: 'Voiced v sound' },
        { word: 'jam', ipa: 'dʒæm', hint: 'J affricate' },
    ],

    // Level 2: Long vowels and common diphthongs
    level2: [
        { word: 'day', ipa: 'deɪ', hint: 'Diphthong ending in i' },
        { word: 'see', ipa: 'si', hint: 'Long e sound' },
        { word: 'go', ipa: 'ɡoʊ', hint: 'Diphthong ending in u' },
        { word: 'my', ipa: 'maɪ', hint: 'Diphthong' },
        { word: 'cow', ipa: 'kaʊ', hint: 'Diphthong' },
        { word: 'boy', ipa: 'bɔɪ', hint: 'Diphthong starting with open o' },
        { word: 'make', ipa: 'meɪk', hint: 'Long a diphthong' },
        { word: 'home', ipa: 'hoʊm', hint: 'Long o diphthong' },
        { word: 'time', ipa: 'taɪm', hint: 'Long i diphthong' },
        { word: 'boat', ipa: 'boʊt', hint: 'Long o diphthong' },
        { word: 'house', ipa: 'haʊs', hint: 'Diphthong' },
        { word: 'night', ipa: 'naɪt', hint: 'Silent letters, diphthong' },
        { word: 'rain', ipa: 'ɹeɪn', hint: 'Long a diphthong' },
        { word: 'moon', ipa: 'mun', hint: 'Long u sound' },
        { word: 'food', ipa: 'fud', hint: 'Long u' },
        { word: 'book', ipa: 'bʊk', hint: 'Short u (not long)' },
        { word: 'look', ipa: 'lʊk', hint: 'Short oo' },
        { word: 'toy', ipa: 'tɔɪ', hint: 'Diphthong' },
        { word: 'play', ipa: 'pleɪ', hint: 'Blend + diphthong' },
        { word: 'show', ipa: 'ʃoʊ', hint: 'Sh sound + diphthong' },
        { word: 'blue', ipa: 'blu', hint: 'Long u sound' },
        { word: 'tree', ipa: 'tɹi', hint: 'Long e sound' },
        { word: 'fly', ipa: 'flaɪ', hint: 'Diphthong' },
        { word: 'now', ipa: 'naʊ', hint: 'Diphthong' },
        { word: 'noise', ipa: 'nɔɪz', hint: 'Diphthong + z' },
        { word: 'cool', ipa: 'kul', hint: 'Long u sound' },
        { word: 'place', ipa: 'pleɪs', hint: 'Diphthong' },
        { word: 'late', ipa: 'leɪt', hint: 'Diphthong' },
        { word: 'ice', ipa: 'aɪs', hint: 'Diphthong' },
        { word: 'joy', ipa: 'dʒɔɪ', hint: 'J + diphthong' },
    ],

    // Level 3: Consonant clusters and th/sh sounds
    level3: [
        { word: 'think', ipa: 'θɪŋk', hint: 'Voiceless th + ng sound' },
        { word: 'this', ipa: 'ðɪs', hint: 'Voiced th sound' },
        { word: 'ship', ipa: 'ʃɪp', hint: 'Sh sound' },
        { word: 'measure', ipa: 'mɛʒɚ', hint: 'Zh sound in middle' },
        { word: 'church', ipa: 'tʃɝtʃ', hint: 'Ch is affricate' },
        { word: 'judge', ipa: 'dʒʌdʒ', hint: 'J is affricate' },
        { word: 'string', ipa: 'stɹɪŋ', hint: 'Three consonant cluster' },
        { word: 'splash', ipa: 'splæʃ', hint: 'Three consonant cluster' },
        { word: 'strength', ipa: 'stɹɛŋkθ', hint: 'Complex cluster' },
        { word: 'left', ipa: 'lɛft', hint: 'Final cluster' },
        { word: 'next', ipa: 'nɛkst', hint: 'X = ks cluster' },
        { word: 'thanks', ipa: 'θæŋks', hint: 'Th + ng + ks' },
        { word: 'both', ipa: 'boʊθ', hint: 'Final voiceless th' },
        { word: 'with', ipa: 'wɪð', hint: 'Final voiced th' },
        { word: 'breathe', ipa: 'bɹið', hint: 'Voiced th, long e' },
        { word: 'cloth', ipa: 'klɔθ', hint: 'Cluster + th' },
        { word: 'sixth', ipa: 'sɪksθ', hint: 'Complex final cluster' },
        { word: 'shrimp', ipa: 'ʃɹɪmp', hint: 'Sh + r blend' },
        { word: 'thrive', ipa: 'θɹaɪv', hint: 'Th + r blend' },
        { word: 'through', ipa: 'θɹu', hint: 'Th + r, long u' },
    ],

    // Level 4: Multi-syllable words with stress markers
    level4: [
        { word: 'banana', ipa: 'bəˈnænə', hint: 'Stress on second syllable' },
        { word: 'computer', ipa: 'kəmˈpjutɚ', hint: 'Stress on second syllable' },
        { word: 'elephant', ipa: 'ˈɛləfənt', hint: 'Stress on first syllable' },
        { word: 'important', ipa: 'ɪmˈpɔɹtənt', hint: 'Stress on second syllable' },
        { word: 'beautiful', ipa: 'ˈbjutəfəl', hint: 'Stress on first syllable' },
        { word: 'telephone', ipa: 'ˈtɛləfoʊn', hint: 'Stress on first syllable' },
        { word: 'understand', ipa: 'ˌʌndɚˈstænd', hint: 'Secondary + primary stress' },
        { word: 'information', ipa: 'ˌɪnfɚˈmeɪʃən', hint: 'Secondary + primary stress' },
        { word: 'education', ipa: 'ˌɛdʒəˈkeɪʃən', hint: 'Secondary + primary stress' },
        { word: 'celebration', ipa: 'ˌsɛləˈbɹeɪʃən', hint: 'Secondary + primary stress' },
        { word: 'photography', ipa: 'fəˈtɑɡɹəfi', hint: 'Stress on second syllable' },
        { word: 'electricity', ipa: 'ɪˌlɛkˈtɹɪsəti', hint: 'Complex stress pattern' },
        { word: 'communication', ipa: 'kəˌmjunəˈkeɪʃən', hint: 'Multiple syllables' },
        { word: 'imagination', ipa: 'ɪˌmædʒəˈneɪʃən', hint: 'Secondary + primary stress' },
        { word: 'vocabulary', ipa: 'voʊˈkæbjəˌlɛɹi', hint: 'Primary + secondary stress' },
        { word: 'pronunciation', ipa: 'pɹəˌnʌnsiˈeɪʃən', hint: 'Challenging word!' },
        { word: 'opportunity', ipa: 'ˌɑpɚˈtunəti', hint: 'Secondary + primary stress' },
        { word: 'responsibility', ipa: 'ɹɪˌspɑnsəˈbɪləti', hint: 'Complex pattern' },
        { word: 'administration', ipa: 'ədˌmɪnəˈstɹeɪʃən', hint: 'Long word!' },
        { word: 'international', ipa: 'ˌɪntɚˈnæʃənəl', hint: 'Secondary + primary' },
    ],

    // Level 5: Challenging words with unusual spellings/sounds
    level5: [
        { word: 'squirrel', ipa: 'ˈskwɝəl', hint: 'Tricky spelling' },
        { word: 'rhythm', ipa: 'ˈɹɪðəm', hint: 'No vowel letters!' },
        { word: 'thorough', ipa: 'ˈθɝoʊ', hint: 'Silent letters' },
        { word: 'colonel', ipa: 'ˈkɝnəl', hint: 'Spelling vs sound mismatch' },
        { word: 'choir', ipa: 'ˈkwaɪɚ', hint: 'Ch = k sound' },
        { word: 'psychology', ipa: 'saɪˈkɑlədʒi', hint: 'Silent p' },
        { word: 'pneumonia', ipa: 'nuˈmoʊniə', hint: 'Silent p' },
        { word: 'wednesday', ipa: 'ˈwɛnzdeɪ', hint: 'Silent d' },
        { word: 'subtle', ipa: 'ˈsʌtəl', hint: 'Silent b' },
        { word: 'island', ipa: 'ˈaɪlənd', hint: 'Silent s' },
        { word: 'listen', ipa: 'ˈlɪsən', hint: 'Silent t' },
        { word: 'castle', ipa: 'ˈkæsəl', hint: 'Silent t' },
        { word: 'receipt', ipa: 'ɹɪˈsit', hint: 'Silent p' },
        { word: 'doubt', ipa: 'daʊt', hint: 'Silent b' },
        { word: 'cough', ipa: 'kɔf', hint: 'Ough = off' },
        { word: 'though', ipa: 'ðoʊ', hint: 'Ough = oh' },
        { word: 'through', ipa: 'θɹu', hint: 'Ough = oo' },
        { word: 'rough', ipa: 'ɹʌf', hint: 'Ough = uff' },
        { word: 'worcestershire', ipa: 'ˈwʊstɚʃɪɹ', hint: 'The famous hard one!' },
        { word: 'lieutenant', ipa: 'luˈtɛnənt', hint: 'British vs American' },
    ],
};

// Level metadata
export const levelInfo = {
    level1: {
        name: 'Basics',
        description: 'Simple consonants and short vowels',
        color: '#4ECDC4',
        requiredCorrect: 8,
        unlocked: true,
    },
    level2: {
        name: 'Vowel Variety',
        description: 'Long vowels and diphthongs',
        color: '#45B7D1',
        requiredCorrect: 8,
        unlocked: false,
    },
    level3: {
        name: 'Clusters & Fricatives',
        description: 'Consonant clusters and th/sh sounds',
        color: '#96CEB4',
        requiredCorrect: 8,
        unlocked: false,
    },
    level4: {
        name: 'Stress Master',
        description: 'Multi-syllable words with stress markers',
        color: '#DDA0DD',
        requiredCorrect: 8,
        unlocked: false,
    },
    level5: {
        name: 'Expert Mode',
        description: 'Challenging words with unusual spellings',
        color: '#FF6B6B',
        requiredCorrect: 8,
        unlocked: false,
    },
};

// Every word across all levels (used by "all difficulties" pools).
export const getAllWords = () => Object.values(wordDatabase).flat();

// Get the word pool for a level, or every word when level is 'all'.
export const getWordPool = (level) =>
    level === 'all' ? getAllWords() : (wordDatabase[level] || []);

// Get a random word from a specific level (or 'all' levels).
export const getRandomWord = (level) => {
    const words = getWordPool(level);
    return words[Math.floor(Math.random() * words.length)];
};

// Check if IPA answer is correct (with some flexibility for common variations)
export const checkAnswer = (userAnswer, correctIPA) => {
    // Normalize both strings
    const normalize = (str) => str.trim().toLowerCase();

    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctIPA);

    // Exact match
    if (normalizedUser === normalizedCorrect) return true;

    // Allow some common variations
    // r-colored vowel variations
    const variations = [
        [/ɝ/g, 'ɜɹ'],
        [/ɚ/g, 'əɹ'],
        [/ɹ/g, 'r'],
        [/ɡ/g, 'g'],
    ];

    let userVariant = normalizedUser;
    let correctVariant = normalizedCorrect;

    variations.forEach(([pattern, replacement]) => {
        userVariant = userVariant.replace(pattern, replacement);
        correctVariant = correctVariant.replace(pattern, replacement);
    });

    return userVariant === correctVariant;
};
