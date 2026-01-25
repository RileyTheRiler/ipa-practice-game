// IPA Symbol Database - Organized by category for learning and keyboard layout

export const ipaCategories = {
    vowels: {
        front: [
            { symbol: 'i', name: 'close front unrounded', example: 'bead' },
            { symbol: 'ɪ', name: 'near-close front unrounded', example: 'bit' },
            { symbol: 'e', name: 'close-mid front unrounded', example: 'bay' },
            { symbol: 'ɛ', name: 'open-mid front unrounded', example: 'bed' },
            { symbol: 'æ', name: 'near-open front unrounded', example: 'bat' },
        ],
        central: [
            { symbol: 'ə', name: 'schwa', example: 'about' },
            { symbol: 'ʌ', name: 'open-mid back unrounded', example: 'but' },
            { symbol: 'ɜ', name: 'open-mid central unrounded', example: 'bird (British)' },
            { symbol: 'ɚ', name: 'r-colored schwa', example: 'butter' },
            { symbol: 'ɝ', name: 'r-colored open-mid central', example: 'bird (American)' },
        ],
        back: [
            { symbol: 'u', name: 'close back rounded', example: 'boot' },
            { symbol: 'ʊ', name: 'near-close back rounded', example: 'book' },
            { symbol: 'o', name: 'close-mid back rounded', example: 'boat' },
            { symbol: 'ɔ', name: 'open-mid back rounded', example: 'bought' },
            { symbol: 'ɑ', name: 'open back unrounded', example: 'father' },
            { symbol: 'ɒ', name: 'open back rounded', example: 'lot (British)' },
        ],
    },
    consonants: {
        stops: [
            { symbol: 'p', name: 'voiceless bilabial stop', example: 'pat' },
            { symbol: 'b', name: 'voiced bilabial stop', example: 'bat' },
            { symbol: 't', name: 'voiceless alveolar stop', example: 'top' },
            { symbol: 'd', name: 'voiced alveolar stop', example: 'dog' },
            { symbol: 'k', name: 'voiceless velar stop', example: 'cat' },
            { symbol: 'ɡ', name: 'voiced velar stop', example: 'go' },
            { symbol: 'ʔ', name: 'glottal stop', example: 'uh-oh' },
        ],
        fricatives: [
            { symbol: 'f', name: 'voiceless labiodental fricative', example: 'fan' },
            { symbol: 'v', name: 'voiced labiodental fricative', example: 'van' },
            { symbol: 'θ', name: 'voiceless dental fricative', example: 'thin' },
            { symbol: 'ð', name: 'voiced dental fricative', example: 'this' },
            { symbol: 's', name: 'voiceless alveolar fricative', example: 'sat' },
            { symbol: 'z', name: 'voiced alveolar fricative', example: 'zoo' },
            { symbol: 'ʃ', name: 'voiceless postalveolar fricative', example: 'ship' },
            { symbol: 'ʒ', name: 'voiced postalveolar fricative', example: 'measure' },
            { symbol: 'h', name: 'voiceless glottal fricative', example: 'hat' },
        ],
        affricates: [
            { symbol: 'tʃ', name: 'voiceless postalveolar affricate', example: 'church' },
            { symbol: 'dʒ', name: 'voiced postalveolar affricate', example: 'judge' },
        ],
        nasals: [
            { symbol: 'm', name: 'voiced bilabial nasal', example: 'man' },
            { symbol: 'n', name: 'voiced alveolar nasal', example: 'no' },
            { symbol: 'ŋ', name: 'voiced velar nasal', example: 'sing' },
        ],
        liquids: [
            { symbol: 'l', name: 'voiced alveolar lateral', example: 'let' },
            { symbol: 'ɹ', name: 'voiced alveolar approximant', example: 'red' },
            { symbol: 'ɾ', name: 'voiced alveolar tap', example: 'butter (American)' },
            { symbol: 'r', name: 'voiced alveolar trill', example: 'perro (Spanish)' },
        ],
        glides: [
            { symbol: 'w', name: 'voiced labial-velar approximant', example: 'wait' },
            { symbol: 'j', name: 'voiced palatal approximant', example: 'yes' },
            { symbol: 'ʍ', name: 'voiceless labial-velar fricative', example: 'which (traditional)' },
        ],
    },
    diacritics: {
        stress: [
            { symbol: 'ˈ', name: 'primary stress', example: 'ˈbætəl (battle)' },
            { symbol: 'ˌ', name: 'secondary stress', example: 'ˌɪndəˈpɛndənt' },
        ],
        length: [
            { symbol: 'ː', name: 'long vowel', example: 'biːt (beat)' },
        ],
        syllable: [
            { symbol: '.', name: 'syllable break', example: 'hæp.i (happy)' },
        ],
    },
    diphthongs: [
        { symbol: 'aɪ', name: 'diphthong', example: 'my, high' },
        { symbol: 'aʊ', name: 'diphthong', example: 'how, out' },
        { symbol: 'eɪ', name: 'diphthong', example: 'day, make' },
        { symbol: 'oʊ', name: 'diphthong', example: 'go, home' },
        { symbol: 'ɔɪ', name: 'diphthong', example: 'boy, coin' },
    ],
};

// Flat list of all single-character IPA symbols for the keyboard
export const allIPASymbols = [
    // Vowels
    'i', 'ɪ', 'e', 'ɛ', 'æ', 'ə', 'ʌ', 'ɜ', 'ɚ', 'ɝ', 'u', 'ʊ', 'o', 'ɔ', 'ɑ', 'ɒ',
    // Consonants
    'p', 'b', 't', 'd', 'k', 'ɡ', 'ʔ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h',
    'm', 'n', 'ŋ', 'l', 'ɹ', 'ɾ', 'r', 'w', 'j', 'ʍ',
    // Diacritics
    'ˈ', 'ˌ', 'ː', '.',
];

// Symbol type lookup for coloring
export const getSymbolType = (symbol) => {
    const vowels = ['i', 'ɪ', 'e', 'ɛ', 'æ', 'ə', 'ʌ', 'ɜ', 'ɚ', 'ɝ', 'u', 'ʊ', 'o', 'ɔ', 'ɑ', 'ɒ', 'a'];
    const diacritics = ['ˈ', 'ˌ', 'ː', '.'];

    if (vowels.includes(symbol)) return 'vowel';
    if (diacritics.includes(symbol)) return 'diacritic';
    return 'consonant';
};
