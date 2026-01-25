// Keyboard shortcuts for typing IPA symbols with a regular keyboard
// Format: key (or key combo) → IPA symbol

// Direct key mappings (just press the key)
export const directMappings = {
    // Letters that are the same in IPA
    'a': 'a',
    'b': 'b',
    'd': 'd',
    'e': 'e',
    'f': 'f',
    'g': 'ɡ', // IPA uses a different g character
    'h': 'h',
    'i': 'i',
    'j': 'j',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'o': 'o',
    'p': 'p',
    'r': 'ɹ', // American English r
    's': 's',
    't': 't',
    'u': 'u',
    'v': 'v',
    'w': 'w',
    'z': 'z',
    ' ': ' ',
    '.': '.',
};

// Shift + key mappings (hold Shift)
export const shiftMappings = {
    'A': 'ɑ', // "father" vowel
    'E': 'ɛ', // "bed" vowel
    'I': 'ɪ', // "bit" vowel  
    'O': 'ɔ', // "bought" vowel
    'U': 'ʌ', // "but" vowel
    'R': 'r', // trilled r
    'G': 'ŋ', // "sing" ending
    'N': 'ŋ', // alternate for ng
    'T': 'θ', // "think" th
    'D': 'ð', // "this" th
    'S': 'ʃ', // "ship" sh
    'Z': 'ʒ', // "measure" zh
    'C': 'tʃ', // "church" ch
    'J': 'dʒ', // "judge" j
    '@': 'ə', // schwa (Shift+2)
    '^': 'ʌ', // caret for "but" vowel (Shift+6)
    ':': 'ː', // length mark
    '\'': 'ˈ', // primary stress
    '"': 'ˌ', // secondary stress (Shift+')
};

// Alt + key mappings (hold Alt) - for less common symbols
export const altMappings = {
    'a': 'æ', // "cat" vowel
    'e': 'ə', // schwa
    'o': 'ɔ', // "bought" vowel
    'u': 'ʊ', // "book" vowel
    'r': 'ɚ', // r-colored schwa
    'i': 'ɪ', // "bit" vowel
    '?': 'ʔ', // glottal stop
    't': 'ɾ', // tap/flap (American "butter")
};

// Get the IPA symbol for a keyboard event
export const getIPAFromKeyEvent = (event) => {
    const key = event.key;

    // Check Alt combinations first
    if (event.altKey && !event.ctrlKey) {
        const lowerKey = key.toLowerCase();
        if (altMappings[lowerKey]) {
            return altMappings[lowerKey];
        }
    }

    // Check Shift combinations
    if (event.shiftKey && !event.ctrlKey && !event.altKey) {
        if (shiftMappings[key]) {
            return shiftMappings[key];
        }
    }

    // Check direct mappings (no modifiers)
    if (!event.ctrlKey && !event.altKey) {
        if (directMappings[key]) {
            return directMappings[key];
        }
    }

    return null;
};

// Human-readable shortcut descriptions for the help panel
export const shortcutGuide = [
    {
        category: 'Vowels', shortcuts: [
            { keys: 'a', symbol: 'a', example: 'father (partial)' },
            { keys: 'Shift+A', symbol: 'ɑ', example: 'father' },
            { keys: 'Alt+a', symbol: 'æ', example: 'cat' },
            { keys: 'e', symbol: 'e', example: 'bay' },
            { keys: 'Shift+E', symbol: 'ɛ', example: 'bed' },
            { keys: 'Alt+e', symbol: 'ə', example: 'about (schwa)' },
            { keys: 'i', symbol: 'i', example: 'see' },
            { keys: 'Shift+I or Alt+i', symbol: 'ɪ', example: 'bit' },
            { keys: 'o', symbol: 'o', example: 'go' },
            { keys: 'Shift+O', symbol: 'ɔ', example: 'caught' },
            { keys: 'u', symbol: 'u', example: 'boot' },
            { keys: 'Shift+U', symbol: 'ʌ', example: 'but' },
            { keys: 'Alt+u', symbol: 'ʊ', example: 'book' },
            { keys: 'Alt+r', symbol: 'ɚ', example: 'butter' },
        ]
    },
    {
        category: 'Consonants', shortcuts: [
            { keys: 'r', symbol: 'ɹ', example: 'red (American)' },
            { keys: 'Shift+R', symbol: 'r', example: 'trilled r' },
            { keys: 'Alt+t', symbol: 'ɾ', example: 'butter (tap)' },
            { keys: 'Shift+T', symbol: 'θ', example: 'think' },
            { keys: 'Shift+D', symbol: 'ð', example: 'this' },
            { keys: 'Shift+S', symbol: 'ʃ', example: 'ship' },
            { keys: 'Shift+Z', symbol: 'ʒ', example: 'measure' },
            { keys: 'Shift+C', symbol: 'tʃ', example: 'church' },
            { keys: 'Shift+J', symbol: 'dʒ', example: 'judge' },
            { keys: 'Shift+G or Shift+N', symbol: 'ŋ', example: 'sing' },
        ]
    },
    {
        category: 'Diacritics', shortcuts: [
            { keys: "' (apostrophe)", symbol: 'ˈ', example: 'primary stress' },
            { keys: '" (quote)', symbol: 'ˌ', example: 'secondary stress' },
            { keys: 'Shift+:', symbol: 'ː', example: 'long vowel' },
        ]
    },
];

export default {
    directMappings,
    shiftMappings,
    altMappings,
    getIPAFromKeyEvent,
    shortcutGuide,
};
