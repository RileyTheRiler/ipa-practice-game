// Spanish (es) grapheme-to-phoneme provider.
//
// Spanish orthography is highly regular, so a small rule set covers most words.
// This is a *worked example* of the multi-language framework in utils/g2p.js —
// it is not exhaustive (no per-region variation, no stress placement).
//
// Conventions used (broadly Latin American "seseo"/"yeísmo"):
//   c/z before e,i -> /s/   (no /θ/ distinction)
//   ll, y          -> /ʝ/
//   single r       -> /ɾ/   (trill /r/ only word-initial or written "rr")

const RULES = [
    // Digraphs / context-sensitive clusters (longest first).
    [/^que/, 'ke'], [/^qui/, 'ki'],
    [/^gue/, 'ɡe'], [/^gui/, 'ɡi'],
    [/^güe/, 'ɡwe'], [/^güi/, 'ɡwi'],
    [/^ch/, 'tʃ'], [/^ll/, 'ʝ'], [/^rr/, 'r'],
    [/^ce/, 'se'], [/^ci/, 'si'],
    [/^ge/, 'xe'], [/^gi/, 'xi'],
    [/^qu/, 'k'],
    // Vowels (accented forms map to the same quality).
    [/^a/, 'a'], [/^á/, 'a'], [/^e/, 'e'], [/^é/, 'e'],
    [/^i/, 'i'], [/^í/, 'i'], [/^o/, 'o'], [/^ó/, 'o'],
    [/^u/, 'u'], [/^ú/, 'u'], [/^ü/, 'u'],
    // Consonants.
    [/^b/, 'b'], [/^v/, 'b'], [/^c/, 'k'], [/^d/, 'd'], [/^f/, 'f'],
    [/^g/, 'ɡ'], [/^h/, ''], [/^j/, 'x'], [/^k/, 'k'], [/^l/, 'l'],
    [/^m/, 'm'], [/^n/, 'n'], [/^ñ/, 'ɲ'], [/^p/, 'p'], [/^r/, 'ɾ'],
    [/^s/, 's'], [/^t/, 't'], [/^w/, 'w'], [/^x/, 'ks'], [/^y/, 'ʝ'],
    [/^z/, 's'],
];

// A few very common words / fixed forms.
const DICTIONARY = {
    hola: 'ola', adiós: 'aˈðjos', sí: 'si', no: 'no', gracias: 'ˈɡɾasjas',
    'por': 'poɾ', favor: 'faˈβoɾ', bien: 'bjen', mal: 'mal', agua: 'ˈaɣwa',
    casa: 'ˈkasa', perro: 'ˈpero', niño: 'ˈniɲo', niña: 'ˈniɲa', uno: 'ˈuno',
    dos: 'dos', tres: 'tɾes', yo: 'ʝo', muy: 'mwi', que: 'ke',
};

function ruleBased(word) {
    let w = word.toLowerCase();
    if (!w) return '';
    let out = '';
    let i = 0;
    // Word-initial single "r" is a trill /r/, not a tap /ɾ/.
    if (w[0] === 'r' && w[1] !== 'r') {
        out += 'r';
        i = 1;
    }
    while (i < w.length) {
        const rest = w.slice(i);
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
        if (!matched) i += 1;
    }
    return out;
}

export const spanishProvider = {
    size: Object.keys(DICTIONARY).length,
    transcribeWord(token) {
        const clean = (token || '').toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
        if (!clean) return { ipa: '', source: 'none' };
        if (DICTIONARY[clean]) return { ipa: DICTIONARY[clean], source: 'dictionary' };
        return { ipa: ruleBased(clean), source: 'rules' };
    },
};

export default spanishProvider;
