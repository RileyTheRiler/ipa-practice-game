// Allophonic variation rules for broad transcription
// These rules allow for acceptable phonemic variations

export const allophonicRules = {
  // Vowel variations
  vowels: [
    {
      phoneme: '/i/',
      allophones: ['i', 'iː', 'ɪ'],
      context: 'word-final or stressed',
      explanation: 'In American English, /i/ can be realized as [i], [iː], or even [ɪ] in unstressed positions'
    },
    {
      phoneme: '/u/',
      allophones: ['u', 'uː', 'ʊ'],
      context: 'varies by stress and position',
      explanation: '/u/ varies between [u] (tense) and [ʊ] (lax) depending on phonetic environment'
    },
    {
      phoneme: '/ɪ/',
      allophones: ['ɪ', 'i', 'ɨ'],
      context: 'unstressed syllables',
      explanation: 'The lax /ɪ/ can vary in quality, especially in unstressed syllables'
    },
    {
      phoneme: '/ʊ/',
      allophones: ['ʊ', 'u', 'ʉ'],
      context: 'before dark /l/',
      explanation: 'Near-close back rounded vowel with allophonic variation'
    },
    {
      phoneme: '/ɔ/',
      allophones: ['ɔ', 'ɑ', 'o'],
      context: 'cot-caught merger',
      explanation: 'Many American English speakers merge /ɔ/ and /ɑ/, pronouncing them identically'
    },
    {
      phoneme: '/ɑ/',
      allophones: ['ɑ', 'ɔ', 'ɒ'],
      context: 'cot-caught merger',
      explanation: 'Open back vowel that merges with /ɔ/ in many American dialects'
    }
  ],

  // R-colored vowels (rhotic variations)
  rhotics: [
    {
      phoneme: '/ɝ/',
      allophones: ['ɝ', 'ɜɹ', 'əɹ', 'ɚ'],
      context: 'stressed syllables',
      explanation: 'R-colored stressed vowel can be written as [ɝ] or [ɜɹ] - both are acceptable'
    },
    {
      phoneme: '/ɚ/',
      allophones: ['ɚ', 'əɹ', 'ɝ'],
      context: 'unstressed syllables',
      explanation: 'R-colored schwa, often in unstressed syllables like "butter"'
    },
    {
      phoneme: '/ɹ/',
      allophones: ['ɹ', 'r', 'ɾ'],
      context: 'various positions',
      explanation: 'American English approximant /r/ sound'
    }
  ],

  // Consonant variations
  consonants: [
    {
      phoneme: '/t/',
      allophones: ['t', 'tʰ', 'ɾ', 'ʔ'],
      context: 'varies by position',
      explanation: '/t/ is aspirated [tʰ] initially, flapped [ɾ] between vowels, and often glottalized [ʔ] finally'
    },
    {
      phoneme: '/p/',
      allophones: ['p', 'pʰ'],
      context: 'word-initial vs word-medial',
      explanation: '/p/ is aspirated [pʰ] at the start of stressed syllables'
    },
    {
      phoneme: '/k/',
      allophones: ['k', 'kʰ'],
      context: 'word-initial vs word-medial',
      explanation: '/k/ is aspirated [kʰ] at the start of stressed syllables'
    },
    {
      phoneme: '/d/',
      allophones: ['d', 'ɾ'],
      context: 'intervocalic',
      explanation: '/d/ becomes a flap [ɾ] between vowels in American English'
    },
    {
      phoneme: '/n/',
      allophones: ['n', 'ŋ', 'ɱ', 'n̩'],
      context: 'assimilation contexts',
      explanation: '/n/ assimilates to following consonants and can be syllabic [n̩]'
    },
    {
      phoneme: '/l/',
      allophones: ['l', 'ɫ', 'l̩'],
      context: 'clear vs dark /l/',
      explanation: 'Clear [l] before vowels, dark [ɫ] after vowels or syllabic [l̩]'
    },
    {
      phoneme: '/ɡ/',
      allophones: ['ɡ', 'g'],
      context: 'always',
      explanation: 'IPA uses [ɡ] but [g] is commonly written - both acceptable'
    }
  ],

  // Stress and suprasegmentals
  suprasegmentals: [
    {
      feature: 'primary stress',
      symbols: ['ˈ', 'ʹ', "'"],
      explanation: 'Primary stress can be marked with ˈ, ʹ, or even an apostrophe in broad transcription'
    },
    {
      feature: 'secondary stress',
      symbols: ['ˌ', 'ˏ', ','],
      explanation: 'Secondary stress marked with ˌ or ˏ'
    },
    {
      feature: 'length',
      symbols: ['ː', ''],
      explanation: 'Length markers (ː) are optional in broad phonemic transcription'
    }
  ],

  // Common phonetic processes
  processes: [
    {
      name: 'Flapping',
      description: '/t/ and /d/ → [ɾ] between vowels',
      examples: ['butter → bʌɾɚ', 'ladder → læɾɚ'],
      explanation: 'Both /t/ and /d/ become flaps [ɾ] between vowels in American English'
    },
    {
      name: 'Aspiration',
      description: '/p, t, k/ → [pʰ, tʰ, kʰ] at start of stressed syllables',
      examples: ['pin → pʰɪn', 'top → tʰɑp'],
      explanation: 'Voiceless stops are aspirated in syllable-initial position'
    },
    {
      name: 'Vowel nasalization',
      description: 'Vowels become nasalized before nasal consonants',
      examples: ['can → kæ̃n', 'run → ɹʌ̃n'],
      explanation: 'Oral vowels become nasalized when preceding nasal consonants'
    },
    {
      name: 'L-vocalization',
      description: 'Dark /l/ becomes vowel-like or disappears',
      examples: ['milk → mɪʊk', 'help → hɛʊp'],
      explanation: 'In some dialects, coda /l/ is vocalized to [ʊ] or [w]'
    },
    {
      name: 'G-dropping',
      description: '/ŋ/ written without /ɡ/ in -ing endings',
      examples: ['running → ɹʌnɪŋ (not ɹʌnɪŋɡ)'],
      explanation: 'Word-final -ing is /ɪŋ/, not /ɪŋɡ/'
    }
  ]
};

// Function to get all acceptable variations for a phoneme
export function getAllophones(phoneme) {
  const cleaned = phoneme.replace(/[\/\[\]]/g, '');

  // Check vowels
  for (const rule of allophonicRules.vowels) {
    if (rule.allophones.includes(cleaned)) {
      return rule.allophones;
    }
  }

  // Check rhotics
  for (const rule of allophonicRules.rhotics) {
    if (rule.allophones.includes(cleaned)) {
      return rule.allophones;
    }
  }

  // Check consonants
  for (const rule of allophonicRules.consonants) {
    if (rule.allophones.includes(cleaned)) {
      return rule.allophones;
    }
  }

  // Return just the phoneme if no allophones found
  return [cleaned];
}

// Function to explain why an answer might be wrong
export function explainAllophoneError(userSymbol, expectedSymbol) {
  const userClean = userSymbol.replace(/[\/\[\]]/g, '');
  const expectedClean = expectedSymbol.replace(/[\/\[\]]/g, '');

  // Check if they're allophones of each other
  const allRules = [
    ...allophonicRules.vowels,
    ...allophonicRules.rhotics,
    ...allophonicRules.consonants
  ];

  for (const rule of allRules) {
    if (rule.allophones.includes(userClean) && rule.allophones.includes(expectedClean)) {
      return {
        isAllophonic: true,
        phoneme: rule.phoneme,
        explanation: rule.explanation,
        message: `Close! Both [${userClean}] and [${expectedClean}] are variants of ${rule.phoneme}. ${rule.explanation}`
      };
    }
  }

  return {
    isAllophonic: false,
    message: null
  };
}

// Get explanation for a specific phonetic process
export function getProcessExplanation(processName) {
  const process = allophonicRules.processes.find(p => p.name === processName);
  return process || null;
}

// Check if two transcriptions are equivalent under broad transcription rules
export function areBroadlyEquivalent(transcription1, transcription2) {
  // Normalize both transcriptions
  const normalize = (str) => str.trim().toLowerCase().replace(/[\/\[\]]/g, '');

  const t1 = normalize(transcription1);
  const t2 = normalize(transcription2);

  // If exactly equal, return true
  if (t1 === t2) return true;

  // Split into segments and compare
  const segments1 = splitIntoSegments(t1);
  const segments2 = splitIntoSegments(t2);

  if (segments1.length !== segments2.length) return false;

  // Check each segment pair
  for (let i = 0; i < segments1.length; i++) {
    const seg1 = segments1[i];
    const seg2 = segments2[i];

    if (seg1 === seg2) continue;

    // Check if they're allophones
    const allophones1 = getAllophones(seg1);
    const allophones2 = getAllophones(seg2);

    // If either segment is an allophone of the other's phoneme
    const isEquivalent = allophones1.includes(seg2) || allophones2.includes(seg1);

    if (!isEquivalent) return false;
  }

  return true;
}

// Helper function to split IPA string into segments
function splitIntoSegments(ipaString) {
  const segments = [];
  let i = 0;

  while (i < ipaString.length) {
    let segment = ipaString[i];

    // Check for diacritics and length markers
    if (i + 1 < ipaString.length) {
      const nextChar = ipaString[i + 1];
      // Diacritics and modifiers
      if ('ːˈˌ̥̩̯̃̊͡'.includes(nextChar) || nextChar.charCodeAt(0) >= 768 && nextChar.charCodeAt(0) <= 879) {
        segment += nextChar;
        i++;
      }
    }

    segments.push(segment);
    i++;
  }

  return segments.filter(s => !['ˈ', 'ˌ', 'ː', '.'].includes(s)); // Filter out stress and syllable boundaries
}

export default allophonicRules;
