// Grapheme-to-Phoneme (G2P) engine for English -> General American IPA.
//
// This is the "phonetic conversion" stage of a live-captioning pipeline:
//   ASR (Web Speech API) -> standard text -> G2P (this file) -> IPA caption.
//
// Strategy:
//   1. Dictionary lookup first. We reuse the curated wordDatabase plus a
//      hand-written list of high-frequency / irregular words. Dictionary hits
//      are accurate and cheap.
//   2. Rule-based fallback for out-of-vocabulary words. This produces a
//      "broad" transcription good enough for live captions, trading some
//      precision for the ability to handle any word the ASR throws at us.

import { wordDatabase } from '../data/wordDatabase';

// --- High-frequency / irregular words that the rules handle poorly ---------
// Broad General American transcriptions (no stress marks for the short ones).
const COMMON_WORDS = {
    a: 'ə', an: 'ən', the: 'ðə', and: 'ænd', of: 'ʌv', to: 'tu', in: 'ɪn',
    is: 'ɪz', it: 'ɪt', you: 'ju', that: 'ðæt', he: 'hi', she: 'ʃi', was: 'wʌz',
    for: 'fɔɹ', on: 'ɑn', are: 'ɑɹ', as: 'æz', with: 'wɪð', his: 'hɪz',
    they: 'ðeɪ', i: 'aɪ', at: 'æt', be: 'bi', this: 'ðɪs', have: 'hæv',
    from: 'fɹʌm', or: 'ɔɹ', one: 'wʌn', had: 'hæd', by: 'baɪ', word: 'wɜɹd',
    but: 'bʌt', not: 'nɑt', what: 'wʌt', all: 'ɔl', were: 'wɜɹ', we: 'wi',
    when: 'wɛn', your: 'jʊɹ', can: 'kæn', said: 'sɛd', there: 'ðɛɹ',
    use: 'juz', each: 'itʃ', which: 'wɪtʃ', do: 'du', how: 'haʊ', their: 'ðɛɹ',
    if: 'ɪf', will: 'wɪl', up: 'ʌp', other: 'ʌðɚ', about: 'əˈbaʊt', out: 'aʊt',
    many: 'ˈmɛni', then: 'ðɛn', them: 'ðɛm', these: 'ðiz', so: 'soʊ',
    some: 'sʌm', her: 'hɜɹ', would: 'wʊd', make: 'meɪk', like: 'laɪk',
    him: 'hɪm', into: 'ˈɪntu', time: 'taɪm', has: 'hæz', look: 'lʊk',
    two: 'tu', more: 'mɔɹ', write: 'ɹaɪt', go: 'ɡoʊ', see: 'si', no: 'noʊ',
    way: 'weɪ', could: 'kʊd', people: 'ˈpipəl', my: 'maɪ', than: 'ðæn',
    been: 'bɪn', call: 'kɔl', who: 'hu', now: 'naʊ', find: 'faɪnd',
    long: 'lɔŋ', down: 'daʊn', day: 'deɪ', did: 'dɪd', get: 'ɡɛt',
    come: 'kʌm', made: 'meɪd', may: 'meɪ', part: 'pɑɹt', over: 'ˈoʊvɚ',
    new: 'nu', sound: 'saʊnd', take: 'teɪk', only: 'ˈoʊnli', little: 'ˈlɪtəl',
    work: 'wɜɹk', know: 'noʊ', place: 'pleɪs', year: 'jɪɹ', live: 'lɪv',
    me: 'mi', back: 'bæk', give: 'ɡɪv', most: 'moʊst', very: 'ˈvɛɹi',
    after: 'ˈæftɚ', thing: 'θɪŋ', our: 'aʊɚ', just: 'dʒʌst', name: 'neɪm',
    good: 'ɡʊd', sentence: 'ˈsɛntəns', man: 'mæn', think: 'θɪŋk', say: 'seɪ',
    great: 'ɡɹeɪt', where: 'wɛɹ', help: 'hɛlp', through: 'θɹu', much: 'mʌtʃ',
    before: 'bɪˈfɔɹ', line: 'laɪn', right: 'ɹaɪt', too: 'tu', mean: 'min',
    old: 'oʊld', any: 'ˈɛni', same: 'seɪm', tell: 'tɛl', boy: 'bɔɪ',
    follow: 'ˈfɑloʊ', came: 'keɪm', want: 'wɑnt', show: 'ʃoʊ', also: 'ˈɔlsoʊ',
    around: 'əˈɹaʊnd', three: 'θɹi', want_to: 'ˈwɑnə', because: 'bɪˈkɔz',
    does: 'dʌz', another: 'əˈnʌðɚ', well: 'wɛl', large: 'lɑɹdʒ', must: 'mʌst',
    big: 'bɪɡ', even: 'ˈivən', such: 'sʌtʃ', here: 'hɪɹ', why: 'waɪ',
    ask: 'æsk', went: 'wɛnt', men: 'mɛn', read: 'ɹid', need: 'nid',
    land: 'lænd', different: 'ˈdɪfɚənt', home: 'hoʊm', us: 'ʌs', move: 'muv',
    try: 'tɹaɪ', kind: 'kaɪnd', hand: 'hænd', picture: 'ˈpɪktʃɚ',
    again: 'əˈɡɛn', change: 'tʃeɪndʒ', off: 'ɔf', play: 'pleɪ', spell: 'spɛl',
    air: 'ɛɹ', away: 'əˈweɪ', animal: 'ˈænəməl', house: 'haʊs', point: 'pɔɪnt',
    page: 'peɪdʒ', letter: 'ˈlɛtɚ', mother: 'ˈmʌðɚ', answer: 'ˈænsɚ',
    found: 'faʊnd', study: 'ˈstʌdi', still: 'stɪl', learn: 'lɜɹn',
    should: 'ʃʊd', world: 'wɜɹld', high: 'haɪ', every: 'ˈɛvɹi', near: 'nɪɹ',
    add: 'æd', between: 'bɪˈtwin', own: 'oʊn', below: 'bɪˈloʊ',
    country: 'ˈkʌntɹi', plant: 'plænt', last: 'læst', school: 'skul',
    father: 'ˈfɑðɚ', keep: 'kip', tree: 'tɹi', never: 'ˈnɛvɚ', start: 'stɑɹt',
    city: 'ˈsɪti', earth: 'ɜɹθ', eye: 'aɪ', light: 'laɪt', thought: 'θɔt',
    head: 'hɛd', under: 'ˈʌndɚ', story: 'ˈstɔɹi', saw: 'sɔ', left: 'lɛft',
    few: 'fju', while: 'waɪl', along: 'əˈlɔŋ', might: 'maɪt', close: 'kloʊs',
    something: 'ˈsʌmθɪŋ', seem: 'sim', next: 'nɛkst', hard: 'hɑɹd',
    open: 'ˈoʊpən', example: 'ɪɡˈzæmpəl', begin: 'bɪˈɡɪn', walk: 'wɔk',
    once: 'wʌns', water: 'ˈwɔtɚ', been_there: 'bɪn', hello: 'həˈloʊ',
    yes: 'jɛs', okay: 'oʊˈkeɪ', ok: 'oʊˈkeɪ', hi: 'haɪ', bye: 'baɪ',
    one_two: 'wʌn', oh: 'oʊ', uh: 'ʌ', um: 'ʌm',
};

// --- Build the lookup dictionary --------------------------------------------
const dictionary = (() => {
    const dict = {};
    // Curated game words first.
    for (const level of Object.values(wordDatabase)) {
        if (!Array.isArray(level)) continue;
        for (const entry of level) {
            if (entry?.word && entry?.ipa) {
                dict[entry.word.toLowerCase()] = entry.ipa;
            }
        }
    }
    // High-frequency words override / extend.
    for (const [word, ipa] of Object.entries(COMMON_WORDS)) {
        if (!word.includes('_')) dict[word] = ipa;
    }
    return dict;
})();

// Expose dictionary size for UI ("X words known").
export const getDictionarySize = () => Object.keys(dictionary).length;

// --- Rule-based fallback G2P ------------------------------------------------
// Multi-character grapheme patterns are matched greedily, longest first.
// Order matters: digraphs/trigraphs before single letters.
const RULES = [
    // Trigraphs / common endings
    [/^tion/, 'ʃən'], [/^sion/, 'ʒən'], [/^cious/, 'ʃəs'], [/^tious/, 'ʃəs'],
    [/^ought/, 'ɔt'], [/^aught/, 'ɔt'], [/^eigh/, 'eɪ'], [/^igh/, 'aɪ'],
    [/^dge/, 'dʒ'], [/^tch/, 'tʃ'],
    // Vowel digraphs
    [/^ee/, 'i'], [/^ea/, 'i'], [/^oo/, 'u'], [/^ou/, 'aʊ'], [/^ow/, 'aʊ'],
    [/^oa/, 'oʊ'], [/^oi/, 'ɔɪ'], [/^oy/, 'ɔɪ'], [/^ai/, 'eɪ'], [/^ay/, 'eɪ'],
    [/^au/, 'ɔ'], [/^aw/, 'ɔ'], [/^ie/, 'i'], [/^ei/, 'eɪ'], [/^ey/, 'eɪ'],
    [/^ue/, 'u'], [/^ui/, 'u'], [/^eu/, 'ju'], [/^ew/, 'u'],
    // Consonant digraphs
    [/^ch/, 'tʃ'], [/^sh/, 'ʃ'], [/^th/, 'θ'], [/^ph/, 'f'], [/^wh/, 'w'],
    [/^ck/, 'k'], [/^ng/, 'ŋ'], [/^qu/, 'kw'], [/^gh/, ''], [/^kn/, 'n'],
    [/^wr/, 'ɹ'], [/^gn/, 'n'], [/^mb$/, 'm'],
    // r-colored vowels
    [/^ar/, 'ɑɹ'], [/^or/, 'ɔɹ'], [/^er/, 'ɚ'], [/^ir/, 'ɜɹ'], [/^ur/, 'ɜɹ'],
    // Single vowels (default short values; magic-e handled separately)
    [/^a/, 'æ'], [/^e/, 'ɛ'], [/^i/, 'ɪ'], [/^o/, 'ɑ'], [/^u/, 'ʌ'],
    [/^y/, 'ɪ'],
    // Single consonants
    [/^b/, 'b'], [/^c/, 'k'], [/^d/, 'd'], [/^f/, 'f'], [/^g/, 'ɡ'],
    [/^h/, 'h'], [/^j/, 'dʒ'], [/^k/, 'k'], [/^l/, 'l'], [/^m/, 'm'],
    [/^n/, 'n'], [/^p/, 'p'], [/^q/, 'k'], [/^r/, 'ɹ'], [/^s/, 's'],
    [/^t/, 't'], [/^v/, 'v'], [/^w/, 'w'], [/^x/, 'ks'], [/^z/, 'z'],
];

// Soft-c (/s/) and soft-g (/dʒ/) before e, i, y.
const isFrontVowel = (ch) => ch === 'e' || ch === 'i' || ch === 'y';

function ruleBasedG2P(word) {
    let w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return '';

    // Handle silent magic-e: "make", "time", "rope" -> lengthen the vowel.
    // We detect a trailing consonant + e and flag a long-vowel context.
    let magicE = false;
    if (/[a-z][^aeiou]e$/.test(w) && w.length > 2) {
        magicE = true;
        w = w.slice(0, -1); // drop the silent e; lengthen vowels below
    }

    const longVowel = { a: 'eɪ', e: 'i', i: 'aɪ', o: 'oʊ', u: 'ju' };
    let out = '';
    let i = 0;

    while (i < w.length) {
        const rest = w.slice(i);

        // Soft c / soft g need a lookahead, handle before generic rules.
        if (rest[0] === 'c' && isFrontVowel(rest[1])) { out += 's'; i += 1; continue; }
        if (rest[0] === 'g' && isFrontVowel(rest[1])) { out += 'dʒ'; i += 1; continue; }

        // Magic-e lengthening: single vowel that is the last vowel of the word.
        if (magicE && longVowel[rest[0]] && !/[aeiou]/.test(w.slice(i + 1))) {
            out += longVowel[rest[0]];
            i += 1;
            continue;
        }

        let matched = false;
        for (const [pattern, replacement] of RULES) {
            const m = rest.match(pattern);
            if (m) {
                out += replacement;
                i += m[0].length;
                matched = true;
                break;
            }
        }
        if (!matched) i += 1; // skip anything unhandled
    }

    // Final cleanup: collapse accidental double symbols, trailing schwa for
    // syllabic consonants is left as-is for broad transcription.
    return out;
}

// --- Public API -------------------------------------------------------------

// Transcribe a single token. Returns { ipa, source } where source is
// 'dictionary' (accurate) or 'rules' (estimated).
export function transcribeWord(token) {
    const clean = token.toLowerCase().replace(/[^a-z']/g, '');
    if (!clean) return { ipa: '', source: 'none' };

    if (dictionary[clean]) {
        return { ipa: dictionary[clean], source: 'dictionary' };
    }
    // Try without trailing 's' (plurals / 3rd person) and re-add /s/ or /z/.
    if (clean.endsWith('s') && dictionary[clean.slice(0, -1)]) {
        const base = dictionary[clean.slice(0, -1)];
        const last = base[base.length - 1];
        const voiceless = 'ptkfθ'.includes(last);
        return { ipa: base + (voiceless ? 's' : 'z'), source: 'dictionary' };
    }
    // Try without trailing 'ed'.
    if (clean.endsWith('ed') && dictionary[clean.slice(0, -2)]) {
        const base = dictionary[clean.slice(0, -2)];
        const last = base[base.length - 1];
        const ending = 'td'.includes(last) ? 'əd' : ('ptkfθʃs'.includes(last) ? 't' : 'd');
        return { ipa: base + ending, source: 'dictionary' };
    }

    return { ipa: ruleBasedG2P(clean), source: 'rules' };
}

// Transcribe a phrase / sentence into an array of word tokens, each with its
// original text and IPA. Punctuation tokens are preserved as separators.
export function transcribePhrase(text) {
    if (!text) return [];
    const tokens = text.match(/[A-Za-z']+|[^A-Za-z'\s]+/g) || [];
    return tokens.map((tok) => {
        if (/[A-Za-z]/.test(tok)) {
            const { ipa, source } = transcribeWord(tok);
            return { text: tok, ipa, source, isWord: true };
        }
        return { text: tok, ipa: tok, source: 'punct', isWord: false };
    });
}

// Convenience: a plain IPA string for a phrase (slash-delimited broad form).
export function transcribePhraseToString(text) {
    const parts = transcribePhrase(text)
        .map((t) => (t.isWord ? t.ipa : t.text))
        .filter(Boolean);
    // Tidy up spacing before closing punctuation (commas, periods, etc.).
    return parts.join(' ').replace(/\s+([.,!?;:)\]}])/g, '$1');
}
