/**
 * Minimal Pairs Data
 * Curated list of commonly confused IPA sounds with example words
 */

export const minimalPairs = [
    // Vowel pairs
    {
        id: 'i-ɪ',
        pair: ['i', 'ɪ'],
        name: 'Long vs Short I',
        description: '/i/ (as in "seat") vs /ɪ/ (as in "sit")',
        difficulty: 'beginner',
        examples: [
            { words: ['seat', 'sit'], ipa: ['sit', 'sɪt'] },
            { words: ['beat', 'bit'], ipa: ['bit', 'bɪt'] },
            { words: ['sheep', 'ship'], ipa: ['ʃip', 'ʃɪp'] },
            { words: ['feel', 'fill'], ipa: ['fil', 'fɪl'] },
            { words: ['heat', 'hit'], ipa: ['hit', 'hɪt'] },
        ],
        tips: [
            '/i/ is a long, tense vowel - hold it longer',
            '/ɪ/ is short and lax - relax your tongue',
            'Your lips spread more for /i/',
        ],
    },
    {
        id: 'ɛ-æ',
        pair: ['ɛ', 'æ'],
        name: 'Bed vs Bad',
        description: '/ɛ/ (as in "bed") vs /æ/ (as in "bad")',
        difficulty: 'beginner',
        examples: [
            { words: ['bed', 'bad'], ipa: ['bɛd', 'bæd'] },
            { words: ['pen', 'pan'], ipa: ['pɛn', 'pæn'] },
            { words: ['men', 'man'], ipa: ['mɛn', 'mæn'] },
            { words: ['set', 'sat'], ipa: ['sɛt', 'sæt'] },
            { words: ['beg', 'bag'], ipa: ['bɛɡ', 'bæɡ'] },
        ],
        tips: [
            '/æ/ requires a more open mouth (jaw drops further)',
            '/ɛ/ is more mid-height',
            'Try saying "eh" vs "ahh"',
        ],
    },
    {
        id: 'θ-ð',
        pair: ['θ', 'ð'],
        name: 'Think vs This',
        description: '/θ/ (voiceless) vs /ð/ (voiced) - both "th" sounds',
        difficulty: 'intermediate',
        examples: [
            { words: ['think', 'the'], ipa: ['θɪŋk', 'ðə'] },
            { words: ['thin', 'then'], ipa: ['θɪn', 'ðɛn'] },
            { words: ['breath', 'breathe'], ipa: ['brɛθ', 'brið'] },
            { words: ['teeth', 'teethe'], ipa: ['tiθ', 'tið'] },
            { words: ['ether', 'either'], ipa: ['iθɚ', 'iðɚ'] },
        ],
        tips: [
            'Tongue position is the same for both - between teeth',
            '/θ/ is voiceless - no vibration in throat',
            '/ð/ is voiced - feel your throat vibrate',
            'Put your hand on your throat to feel the difference',
        ],
    },
    {
        id: 's-ʃ',
        pair: ['s', 'ʃ'],
        name: 'Sip vs Ship',
        description: '/s/ (as in "sip") vs /ʃ/ (as in "ship")',
        difficulty: 'beginner',
        examples: [
            { words: ['sip', 'ship'], ipa: ['sɪp', 'ʃɪp'] },
            { words: ['see', 'she'], ipa: ['si', 'ʃi'] },
            { words: ['sell', 'shell'], ipa: ['sɛl', 'ʃɛl'] },
            { words: ['sock', 'shock'], ipa: ['sɑk', 'ʃɑk'] },
            { words: ['sue', 'shoe'], ipa: ['su', 'ʃu'] },
        ],
        tips: [
            '/ʃ/ is made further back in the mouth',
            'Lips round more for /ʃ/',
            '/s/ produces a higher-pitched hiss',
        ],
    },
    {
        id: 'ʌ-ə',
        pair: ['ʌ', 'ə'],
        name: 'Strut vs Comma',
        description: '/ʌ/ (stressed) vs /ə/ (unstressed schwa)',
        difficulty: 'intermediate',
        examples: [
            { words: ['but', 'about'], ipa: ['bʌt', 'əbaʊt'] },
            { words: ['cup', 'sofa'], ipa: ['kʌp', 'soʊfə'] },
            { words: ['love', 'the'], ipa: ['lʌv', 'ðə'] },
            { words: ['come', 'comma'], ipa: ['kʌm', 'kɑmə'] },
        ],
        tips: [
            '/ʌ/ only appears in stressed syllables',
            '/ə/ (schwa) is the most common vowel in English',
            'Schwa is always in unstressed syllables',
        ],
    },
    {
        id: 'ɔ-oʊ',
        pair: ['ɔ', 'oʊ'],
        name: 'Caught vs Coat',
        description: '/ɔ/ (as in "caught") vs /oʊ/ (as in "coat")',
        difficulty: 'intermediate',
        examples: [
            { words: ['caught', 'coat'], ipa: ['kɔt', 'koʊt'] },
            { words: ['law', 'low'], ipa: ['lɔ', 'loʊ'] },
            { words: ['saw', 'sow'], ipa: ['sɔ', 'soʊ'] },
            { words: ['call', 'coal'], ipa: ['kɔl', 'koʊl'] },
        ],
        tips: [
            '/oʊ/ is a diphthong - it glides to /ʊ/',
            '/ɔ/ is a pure vowel - stays in one place',
            'Note: Many American speakers merge these sounds',
        ],
    },
    {
        id: 'b-p',
        pair: ['b', 'p'],
        name: 'Voiced vs Voiceless Bilabial',
        description: '/b/ (voiced) vs /p/ (voiceless)',
        difficulty: 'beginner',
        examples: [
            { words: ['bat', 'pat'], ipa: ['bæt', 'pæt'] },
            { words: ['bin', 'pin'], ipa: ['bɪn', 'pɪn'] },
            { words: ['bear', 'pear'], ipa: ['bɛɹ', 'pɛɹ'] },
            { words: ['buy', 'pie'], ipa: ['baɪ', 'paɪ'] },
            { words: ['cab', 'cap'], ipa: ['kæb', 'kæp'] },
        ],
        tips: [
            'Both made with two lips together',
            '/b/ is voiced - vocal cords vibrate',
            '/p/ is voiceless - puff of air released',
        ],
    },
    {
        id: 'n-ŋ',
        pair: ['n', 'ŋ'],
        name: 'N vs NG',
        description: '/n/ (as in "sin") vs /ŋ/ (as in "sing")',
        difficulty: 'intermediate',
        examples: [
            { words: ['sin', 'sing'], ipa: ['sɪn', 'sɪŋ'] },
            { words: ['ran', 'rang'], ipa: ['ɹæn', 'ɹæŋ'] },
            { words: ['thin', 'thing'], ipa: ['θɪn', 'θɪŋ'] },
            { words: ['ban', 'bang'], ipa: ['bæn', 'bæŋ'] },
            { words: ['win', 'wing'], ipa: ['wɪn', 'wɪŋ'] },
        ],
        tips: [
            '/n/ - tongue touches behind upper teeth',
            '/ŋ/ - back of tongue touches soft palate',
            'There is no "g" sound in words ending in /ŋ/',
        ],
    },
    {
        id: 'l-ɹ',
        pair: ['l', 'ɹ'],
        name: 'L vs R',
        description: '/l/ (as in "light") vs /ɹ/ (as in "right")',
        difficulty: 'advanced',
        examples: [
            { words: ['light', 'right'], ipa: ['laɪt', 'ɹaɪt'] },
            { words: ['lead', 'read'], ipa: ['lid', 'ɹid'] },
            { words: ['long', 'wrong'], ipa: ['lɔŋ', 'ɹɔŋ'] },
            { words: ['lice', 'rice'], ipa: ['laɪs', 'ɹaɪs'] },
            { words: ['play', 'pray'], ipa: ['pleɪ', 'pɹeɪ'] },
        ],
        tips: [
            '/l/ - tongue tip touches the ridge behind your teeth',
            '/ɹ/ - tongue does not touch anything',
            'For /ɹ/, curl your tongue slightly back',
        ],
    },
    {
        id: 'aɪ-eɪ',
        pair: ['aɪ', 'eɪ'],
        name: 'Price vs Face',
        description: '/aɪ/ (as in "price") vs /eɪ/ (as in "face")',
        difficulty: 'intermediate',
        examples: [
            { words: ['bite', 'bait'], ipa: ['baɪt', 'beɪt'] },
            { words: ['my', 'may'], ipa: ['maɪ', 'meɪ'] },
            { words: ['line', 'lane'], ipa: ['laɪn', 'leɪn'] },
            { words: ['time', 'tame'], ipa: ['taɪm', 'teɪm'] },
            { words: ['hide', 'hayed'], ipa: ['haɪd', 'heɪd'] },
        ],
        tips: [
            '/aɪ/ starts with a low, open mouth position',
            '/eɪ/ starts mid-height like "eh"',
            'Both end with the tongue moving toward /ɪ/',
        ],
    },
];

/**
 * Get a minimal pair by ID
 */
export function getMinimalPair(id) {
    return minimalPairs.find(pair => pair.id === id) || null;
}

/**
 * Get all minimal pairs for a difficulty level
 */
export function getMinimalPairsByDifficulty(difficulty) {
    return minimalPairs.filter(pair => pair.difficulty === difficulty);
}

/**
 * Get random example from a minimal pair
 */
export function getRandomExample(pairId) {
    const pair = getMinimalPair(pairId);
    if (!pair) return null;
    return pair.examples[Math.floor(Math.random() * pair.examples.length)];
}
