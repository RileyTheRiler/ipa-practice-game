// Generate multiple choice questions with smart distractors

import { wordDatabase, levelInfo } from '../data/wordDatabase';
import { explainAllophoneError, allophonicRules } from './allophonicRules';

// Generate plausible but incorrect IPA transcriptions
export function generateIPADistractors(correctWord, correctIPA, level, count = 3) {
  const distractors = new Set();
  const levelWords = wordDatabase[level] || [];

  // Strategy 1: Use IPA from similar-sounding words in same level
  const similarWords = levelWords
    .filter(w => w.word !== correctWord && w.ipa !== correctIPA)
    .filter(w => {
      // Find words with similar length
      const lengthDiff = Math.abs(w.ipa.length - correctIPA.length);
      return lengthDiff <= 3;
    });

  // Add some from similar words
  similarWords.slice(0, 2).forEach(w => distractors.add(w.ipa));

  // Strategy 2: Create common mistakes by swapping phonemes
  if (distractors.size < count) {
    const commonErrors = createCommonIPAErrors(correctIPA);
    commonErrors.forEach(error => {
      if (distractors.size < count) {
        distractors.add(error);
      }
    });
  }

  // Strategy 3: Use words from other levels if needed
  if (distractors.size < count) {
    const allLevels = Object.keys(wordDatabase);
    for (const lvl of allLevels) {
      if (lvl !== level && distractors.size < count) {
        const otherLevelWords = wordDatabase[lvl]
          .filter(w => w.ipa !== correctIPA && !distractors.has(w.ipa));

        if (otherLevelWords.length > 0) {
          const random = otherLevelWords[Math.floor(Math.random() * otherLevelWords.length)];
          distractors.add(random.ipa);
        }
      }
    }
  }

  // Convert to array and ensure we have enough
  const result = Array.from(distractors);
  while (result.length < count) {
    // Last resort: slightly modify the correct answer
    result.push(createMinorVariation(correctIPA, result));
  }

  return result.slice(0, count);
}

// Create common IPA transcription errors
function createCommonIPAErrors(correctIPA) {
  const errors = [];

  const commonSubstitutions = [
    // Vowel confusions
    { from: 'æ', to: 'ɛ', reason: 'æ/ɛ confusion' },
    { from: 'ɛ', to: 'æ', reason: 'ɛ/æ confusion' },
    { from: 'ɪ', to: 'i', reason: 'tense/lax confusion' },
    { from: 'i', to: 'ɪ', reason: 'tense/lax confusion' },
    { from: 'ʊ', to: 'u', reason: 'tense/lax confusion' },
    { from: 'u', to: 'ʊ', reason: 'tense/lax confusion' },
    { from: 'ʌ', to: 'ə', reason: 'stress confusion' },
    { from: 'ə', to: 'ʌ', reason: 'stress confusion' },
    { from: 'ɔ', to: 'ɑ', reason: 'cot-caught merger' },
    { from: 'ɑ', to: 'ɔ', reason: 'cot-caught merger' },

    // Consonant confusions
    { from: 'θ', to: 'f', reason: 'th-fronting' },
    { from: 'ð', to: 'v', reason: 'th-fronting' },
    { from: 'ɹ', to: 'r', reason: 'r-notation' },
    { from: 'ʃ', to: 's', reason: 'sh/s confusion' },
    { from: 'tʃ', to: 'ʃ', reason: 'affricate confusion' },
    { from: 'dʒ', to: 'ʒ', reason: 'affricate confusion' },
    { from: 'ŋ', to: 'n', reason: 'ng confusion' },

    // R-colored vowels
    { from: 'ɝ', to: 'ɜɹ', reason: 'r-coloring notation' },
    { from: 'ɚ', to: 'əɹ', reason: 'r-coloring notation' },
    { from: 'ɜɹ', to: 'ɝ', reason: 'r-coloring notation' },

    // Stress markers
    { from: 'ˈ', to: '', reason: 'missing stress' },
  ];

  // Apply substitutions
  commonSubstitutions.forEach(({ from, to }) => {
    if (correctIPA.includes(from)) {
      errors.push(correctIPA.replace(new RegExp(from, 'g'), to));
    }
  });

  return errors.filter(e => e !== correctIPA);
}

// Create a minor variation of the IPA
function createMinorVariation(ipa, existingOptions) {
  const variations = [
    ipa.replace(/ˈ/g, ''),           // Remove stress
    ipa.replace(/ɹ/g, 'r'),          // Replace r
    ipa.replace(/ɡ/g, 'g'),          // Replace g variant
    ipa.replace(/i/g, 'ɪ'),          // Tense/lax swap
    ipa.replace(/u/g, 'ʊ'),          // Tense/lax swap
    ipa + 'ː',                       // Add length marker
  ];

  for (const variation of variations) {
    if (variation !== ipa && !existingOptions.includes(variation)) {
      return variation;
    }
  }

  return ipa.replace(/./g, (char, i) => i === 0 ? char.toUpperCase() : char); // Last resort
}

// Generate word distractors for IPA→Word mode
export function generateWordDistractors(correctWord, correctIPA, level, count = 3) {
  const distractors = new Set();
  const levelWords = wordDatabase[level] || [];

  // Strategy 1: Words that sound similar (rhyme, similar start, similar length)
  const similarWords = levelWords
    .filter(w => w.word !== correctWord)
    .filter(w => {
      const word = w.word.toLowerCase();
      const correct = correctWord.toLowerCase();

      // Similar length
      if (Math.abs(word.length - correct.length) <= 2) return true;

      // Rhymes (same ending)
      if (word.slice(-2) === correct.slice(-2)) return true;

      // Similar start
      if (word[0] === correct[0] && word[1] === correct[1]) return true;

      return false;
    });

  similarWords.slice(0, count).forEach(w => distractors.add(w.word));

  // Strategy 2: Words with similar IPA features
  if (distractors.size < count) {
    const ipaFeatureWords = levelWords
      .filter(w => w.word !== correctWord && !distractors.has(w.word))
      .filter(w => {
        // Count shared phonemes
        const sharedPhonemes = countSharedPhonemes(w.ipa, correctIPA);
        return sharedPhonemes >= 2;
      });

    ipaFeatureWords.slice(0, count - distractors.size).forEach(w => distractors.add(w.word));
  }

  // Strategy 3: Random words from same level
  if (distractors.size < count) {
    const remaining = levelWords
      .filter(w => w.word !== correctWord && !distractors.has(w.word))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - distractors.size);

    remaining.forEach(w => distractors.add(w.word));
  }

  // Strategy 4: Use other levels if needed
  if (distractors.size < count) {
    const allWords = Object.values(wordDatabase).flat();
    const moreWords = allWords
      .filter(w => w.word !== correctWord && !distractors.has(w.word))
      .sort(() => Math.random() - 0.5)
      .slice(0, count - distractors.size);

    moreWords.forEach(w => distractors.add(w.word));
  }

  return Array.from(distractors).slice(0, count);
}

// Helper: count shared phonemes between two IPA strings
function countSharedPhonemes(ipa1, ipa2) {
  const segments1 = ipa1.split('').filter(c => c.match(/[a-zæəɛɪʊʌɑɔɝɚɜɹʃʒθðŋɡ]/i));
  const segments2 = ipa2.split('').filter(c => c.match(/[a-zæəɛɪʊʌɑɔɝɚɜɹʃʒθðŋɡ]/i));

  let shared = 0;
  segments1.forEach(seg => {
    if (segments2.includes(seg)) shared++;
  });

  return shared;
}

// Generate a complete multiple choice question
export function generateMultipleChoiceQuestion(gameMode, level) {
  const levelWords = wordDatabase[level];
  if (!levelWords || levelWords.length === 0) {
    return null;
  }

  // Pick a random word
  const questionData = levelWords[Math.floor(Math.random() * levelWords.length)];

  if (gameMode === 'wordToIpa') {
    // Show word, ask for IPA
    const distractors = generateIPADistractors(questionData.word, questionData.ipa, level, 3);
    const options = shuffleArray([
      { text: questionData.ipa, isCorrect: true },
      ...distractors.map(d => ({ text: d, isCorrect: false }))
    ]);

    return {
      question: questionData.word,
      questionType: 'word',
      correctAnswer: questionData.ipa,
      options,
      hint: questionData.hint,
      explanation: generateExplanation(questionData, gameMode)
    };

  } else if (gameMode === 'ipaToWord') {
    // Show IPA, ask for word
    const distractors = generateWordDistractors(questionData.word, questionData.ipa, level, 3);
    const options = shuffleArray([
      { text: questionData.word, isCorrect: true },
      ...distractors.map(d => ({ text: d, isCorrect: false }))
    ]);

    return {
      question: questionData.ipa,
      questionType: 'ipa',
      correctAnswer: questionData.word,
      options,
      hint: questionData.hint,
      explanation: generateExplanation(questionData, gameMode)
    };
  }

  return null;
}

// Generate explanation for the answer
function generateExplanation(wordData, gameMode) {
  const { word, ipa, hint } = wordData;

  const explanation = {
    word,
    ipa,
    breakdown: analyzeIPA(ipa),
    phoneticProcess: identifyPhoneticProcesses(word, ipa),
    tip: hint || generateTip(word, ipa)
  };

  return explanation;
}

// Analyze IPA into phonemes with descriptions
function analyzeIPA(ipa) {
  const breakdown = [];
  const cleaned = ipa.replace(/[ˈˌ]/g, ''); // Remove stress markers for analysis

  // Simple segmentation (can be improved)
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const desc = getPhonemeDescription(char);
    if (desc) {
      breakdown.push({ symbol: char, description: desc });
    }
  }

  return breakdown;
}

// Get description for a phoneme
function getPhonemeDescription(symbol) {
  const descriptions = {
    // Vowels
    'i': 'high front tense vowel (as in "see")',
    'ɪ': 'high front lax vowel (as in "sit")',
    'e': 'mid front vowel (as in "day")',
    'ɛ': 'mid front lax vowel (as in "bed")',
    'æ': 'low front vowel (as in "cat")',
    'ɑ': 'low back vowel (as in "father")',
    'ɔ': 'mid back rounded vowel (as in "caught")',
    'o': 'mid back rounded vowel (as in "go")',
    'ʊ': 'high back lax vowel (as in "book")',
    'u': 'high back tense vowel (as in "boot")',
    'ʌ': 'mid central vowel (as in "but")',
    'ə': 'mid central vowel - schwa (as in "about")',
    'ɝ': 'r-colored mid central vowel (as in "bird")',
    'ɚ': 'r-colored schwa (as in "butter")',

    // Consonants
    'p': 'voiceless bilabial stop',
    'b': 'voiced bilabial stop',
    't': 'voiceless alveolar stop',
    'd': 'voiced alveolar stop',
    'k': 'voiceless velar stop',
    'ɡ': 'voiced velar stop',
    'g': 'voiced velar stop',
    'f': 'voiceless labiodental fricative',
    'v': 'voiced labiodental fricative',
    'θ': 'voiceless dental fricative (as in "think")',
    'ð': 'voiced dental fricative (as in "this")',
    's': 'voiceless alveolar fricative',
    'z': 'voiced alveolar fricative',
    'ʃ': 'voiceless postalveolar fricative (as in "ship")',
    'ʒ': 'voiced postalveolar fricative (as in "measure")',
    'h': 'voiceless glottal fricative',
    'tʃ': 'voiceless postalveolar affricate (as in "church")',
    'dʒ': 'voiced postalveolar affricate (as in "judge")',
    'm': 'bilabial nasal',
    'n': 'alveolar nasal',
    'ŋ': 'velar nasal (as in "sing")',
    'l': 'alveolar lateral',
    'ɹ': 'alveolar approximant (American r)',
    'r': 'alveolar approximant',
    'w': 'labial-velar approximant',
    'j': 'palatal approximant',
    'ɾ': 'alveolar flap (as in "butter")',

    // Diphthongs
    'eɪ': 'diphthong (as in "day")',
    'aɪ': 'diphthong (as in "my")',
    'ɔɪ': 'diphthong (as in "boy")',
    'aʊ': 'diphthong (as in "cow")',
    'oʊ': 'diphthong (as in "go")',
  };

  return descriptions[symbol] || null;
}

// Identify phonetic processes in the word
function identifyPhoneticProcesses(word, ipa) {
  const processes = [];

  // Check for common processes
  if (ipa.includes('ɾ')) {
    processes.push({
      name: 'Flapping',
      description: 'The /t/ or /d/ becomes a flap [ɾ] between vowels',
      example: 'butter → [bʌɾɚ]'
    });
  }

  if (ipa.match(/^[ptk]/) && ipa.includes('ʰ')) {
    processes.push({
      name: 'Aspiration',
      description: 'Voiceless stops are aspirated at the start of stressed syllables',
      example: 'pin → [pʰɪn]'
    });
  }

  if (word.includes('ng') && ipa.includes('ŋ') && !ipa.includes('ŋɡ')) {
    processes.push({
      name: 'G-dropping',
      description: 'The letters "ng" represent just [ŋ], not [ŋɡ]',
      example: 'sing → [sɪŋ] not [sɪŋɡ]'
    });
  }

  if ((word.includes('th') && ipa.includes('θ')) || (word.includes('th') && ipa.includes('ð'))) {
    processes.push({
      name: 'Dental fricatives',
      description: 'The letters "th" can be voiceless [θ] as in "think" or voiced [ð] as in "this"',
      example: 'think → [θɪŋk], this → [ðɪs]'
    });
  }

  if (ipa.includes('ɝ') || ipa.includes('ɚ')) {
    processes.push({
      name: 'R-coloring',
      description: 'Vowels before /r/ become r-colored',
      example: 'bird → [bɝd], butter → [bʌɾɚ]'
    });
  }

  return processes;
}

// Generate a helpful tip
function generateTip(word, ipa) {
  const tips = [
    `Remember: "${word}" is transcribed as /${ipa}/`,
    `The IPA for "${word}" is /${ipa}/ - note the vowel quality`,
    `Listen for the stress pattern in "${word}": /${ipa}/`,
    `Pay attention to the consonant sounds in /${ipa}/`
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

// Shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default {
  generateMultipleChoiceQuestion,
  generateIPADistractors,
  generateWordDistractors
};
