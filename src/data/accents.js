// Target-accent post-transforms.
//
// The g2p engine produces broad General American (GA) IPA. These transforms
// rewrite that GA output into other English accents by applying the major
// systematic correspondences (chiefly rhoticity and a few vowel mergers).
//
// Scope/limitations: these are systematic phonological rules, not lexical-set
// lookups. Splits that depend on the individual word (e.g. the RP TRAP–BATH
// split) are NOT applied, because doing so without a lexical-set dictionary
// would produce wrong results more often than right ones.

// Vowel characters used to detect whether a following segment is a vowel
// (so we know when a rhotic /ɹ/ is in coda position and should be dropped).
const VOWEL_CHARS = 'iɪeɛæəʌɑɔoʊuaɝɚɒɜ';

// A /ɹ/ is only "coda" (and thus dropped in non-rhotic accents) when it is NOT
// immediately followed by a vowel; before a vowel it is a linking/intervocalic
// /ɹ/ and must be kept (e.g. "very" /ˈvɛɹi/, "carry").
const CODA = `(?![${VOWEL_CHARS}])`;

function nonRhotic(ipa) {
    let s = ipa;
    // R-coloured vowels first (longest/most specific first), coda position only.
    s = s
        .replace(new RegExp(`aɪɹ${CODA}`, 'g'), 'aɪə')
        .replace(new RegExp(`aʊɹ${CODA}`, 'g'), 'aʊə')
        .replace(new RegExp(`ɑɹ${CODA}`, 'g'), 'ɑː')
        .replace(new RegExp(`ɔɹ${CODA}`, 'g'), 'ɔː')
        .replace(new RegExp(`ɛɹ${CODA}`, 'g'), 'ɛə')
        .replace(new RegExp(`ɪɹ${CODA}`, 'g'), 'ɪə')
        .replace(new RegExp(`ʊɹ${CODA}`, 'g'), 'ʊə')
        .replace(/ɝ/g, 'ɜː')
        .replace(/ɚ/g, 'ə');
    // Any remaining coda /ɹ/ (not before a vowel) is dropped.
    s = s.replace(new RegExp(`ɹ${CODA}`, 'g'), '');
    return s;
}

export const accents = [
    {
        id: 'ga',
        label: 'General American',
        rhotic: true,
        transform: (ipa) => ipa,
    },
    {
        id: 'rp',
        label: 'Received Pronunciation (UK)',
        rhotic: false,
        transform: (ipa) => {
            let s = nonRhotic(ipa);
            // LOT unrounding: GA /ɑ/ -> RP /ɒ/ (but not the /ɑː/ created above).
            s = s.replace(/ɑ(?!ː)/g, 'ɒ');
            // THOUGHT lengthening: GA /ɔ/ -> RP /ɔː/ (avoid /ɔɪ/ and existing /ɔː/).
            s = s.replace(/ɔ(?![ːɪ])/g, 'ɔː');
            return s;
        },
    },
    {
        id: 'aus',
        label: 'General Australian',
        rhotic: false,
        transform: (ipa) => {
            let s = nonRhotic(ipa);
            // A couple of characteristic Australian diphthong shifts.
            s = s
                .replace(/eɪ/g, 'æɪ') // FACE
                .replace(/oʊ/g, 'əʊ') // GOAT
                .replace(/ɑ(?!ː)/g, 'ɐ'); // LOT/STRUT-ish opening (broad)
            return s;
        },
    },
];

export const getAccent = (id) => accents.find((a) => a.id === id) || accents[0];

export default accents;
