import { useState, useMemo, useEffect, useCallback } from 'react';
import { wordDatabase, getRandomWord, levelInfo } from '../data/wordDatabase';
import { getSymbolType } from '../data/ipaSymbols';
import { getRandomTheme, MAX_WRONG } from '../data/hangmanThemes';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import HangmanScene from './HangmanScene';
import Confetti from './Confetti';
import '../styles/hangman.css';

// Symbols that are revealed for free and never guessed (structure, not sounds).
const STRUCTURAL = new Set([' ', 'ˈ', 'ˌ', 'ː', '.', '-']);

// Convenience map so a physical keyboard can produce a few non-ASCII IPA symbols.
const PHYSICAL_KEYMAP = { g: 'ɡ', r: 'ɹ' };

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

/** @param {string} ch @returns {boolean} whether a character is revealed for free. */
const isStructural = (ch) => STRUCTURAL.has(ch);

/** IPA Hangman: guess a hidden word or transcription one sound at a time. */
export function HangmanGame({ onBack }) {
    const [direction, setDirection] = useState('wordToIpa'); // guess transcription
    const [level, setLevel] = useState('all');
    const [word, setWord] = useState(() => getRandomWord('all'));
    const [theme, setTheme] = useState(() => getRandomTheme());
    const [guessed, setGuessed] = useState(() => new Set());
    const [wrongCount, setWrongCount] = useState(0);
    const [status, setStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const { speak, isSpeaking, isSupported: speechSupported } = useSpeechSynthesis();

    const guessingIpa = direction === 'wordToIpa';

    // The hidden answer the player is spelling out.
    const target = guessingIpa ? word.ipa : word.word.toLowerCase();
    // The clue shown in full.
    const clue = guessingIpa ? word.word : word.ipa;

    // IPA guessing alphabet, derived from every transcription in the database so
    // the answer's symbols are always available (and nothing irrelevant shows up).
    const ipaAlphabet = useMemo(() => {
        const set = new Set();
        Object.values(wordDatabase).flat().forEach((w) => {
            for (const ch of w.ipa) if (!isStructural(ch)) set.add(ch);
        });
        return [...set];
    }, []);

    const ipaVowels = useMemo(
        () => ipaAlphabet.filter((s) => getSymbolType(s) === 'vowel').sort(),
        [ipaAlphabet]
    );
    const ipaConsonants = useMemo(
        () => ipaAlphabet.filter((s) => getSymbolType(s) !== 'vowel').sort(),
        [ipaAlphabet]
    );

    const targetSymbols = useMemo(
        () => new Set([...target].filter((ch) => !isStructural(ch))),
        [target]
    );

    const isRevealed = useCallback(
        (ch) => isStructural(ch) || guessed.has(ch),
        [guessed]
    );

    const startRound = useCallback((nextLevel = level) => {
        setWord(getRandomWord(nextLevel));
        setTheme(getRandomTheme());
        setGuessed(new Set());
        setWrongCount(0);
        setStatus('playing');
        setShowHint(false);
    }, [level]);

    const handleGuess = useCallback(
        (token) => {
            if (status !== 'playing' || guessed.has(token)) return;

            const next = new Set(guessed);
            next.add(token);
            setGuessed(next);

            if (targetSymbols.has(token)) {
                // Win when every guessable symbol has been revealed.
                const remaining = [...targetSymbols].some((s) => !next.has(s));
                if (!remaining) {
                    setStatus('won');
                    setWins((w) => w + 1);
                    setStreak((s) => s + 1);
                }
            } else {
                const newWrong = wrongCount + 1;
                setWrongCount(newWrong);
                if (newWrong >= MAX_WRONG) {
                    setStatus('lost');
                    setLosses((l) => l + 1);
                    setStreak(0);
                }
            }
        },
        [status, guessed, targetSymbols, wrongCount]
    );

    const toggleDirection = () => {
        setDirection(guessingIpa ? 'ipaToWord' : 'wordToIpa');
        startRound(level);
    };

    const changeLevel = (nextLevel) => {
        setLevel(nextLevel);
        startRound(nextLevel);
    };

    // Physical keyboard support.
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            // Don't hijack Enter/Space from a focused button/link/field.
            const target = e.target;
            const isInteractive =
                target instanceof HTMLElement &&
                (target.isContentEditable ||
                    ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName));

            if (status !== 'playing') {
                if (!isInteractive && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    startRound();
                }
                return;
            }

            const key = e.key.toLowerCase();
            if (key.length !== 1) return;

            if (guessingIpa) {
                const candidate = PHYSICAL_KEYMAP[key] || key;
                if (ipaAlphabet.includes(candidate)) {
                    e.preventDefault();
                    handleGuess(candidate);
                }
            } else if (key >= 'a' && key <= 'z') {
                e.preventDefault();
                handleGuess(key);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [status, guessingIpa, ipaAlphabet, handleGuess, startRound]);

    const roundOver = status !== 'playing';

    return (
        <div className="hangman-container">
            <header className="hangman-header">
                <button className="hangman-back" onClick={onBack}>
                    ← Menu
                </button>

                <div className="hangman-mode-toggle">
                    <button
                        className={`mode-pill ${guessingIpa ? 'active' : ''}`}
                        onClick={() => !guessingIpa && toggleDirection()}
                    >
                        Word → IPA
                    </button>
                    <button
                        className={`mode-pill ${!guessingIpa ? 'active' : ''}`}
                        onClick={() => guessingIpa && toggleDirection()}
                    >
                        IPA → Word
                    </button>
                </div>

                <div className="hangman-tally">
                    <span className="tally-item win" title="Rounds won">🏆 {wins}</span>
                    <span className="tally-item streak" title="Win streak">🔥 {streak}</span>
                    <span className="tally-item loss" title="Rounds lost">💧 {losses}</span>
                </div>
            </header>

            <div className="hangman-levels">
                <button
                    className={`level-chip ${level === 'all' ? 'active' : ''}`}
                    onClick={() => changeLevel('all')}
                >
                    All
                </button>
                {Object.entries(levelInfo).map(([key, info], i) => (
                    <button
                        key={key}
                        className={`level-chip ${level === key ? 'active' : ''}`}
                        style={{ '--chip-color': info.color }}
                        onClick={() => changeLevel(key)}
                        title={info.description}
                    >
                        {i + 1}. {info.name}
                    </button>
                ))}
            </div>

            <main className="hangman-main">
                <div className="hangman-left">
                    <HangmanScene theme={theme} wrongCount={wrongCount} status={status} />
                </div>

                <div className="hangman-right">
                    {/* Clue */}
                    <div className="hangman-clue">
                        <span className="clue-label">
                            {guessingIpa ? 'Spell the IPA for:' : 'Spell the word for:'}
                        </span>
                        <span className={`clue-value ${guessingIpa ? 'is-word' : 'is-ipa'}`}>
                            {guessingIpa ? clue : `/${clue}/`}
                            {guessingIpa && speechSupported && (
                                <button
                                    className={`clue-audio ${isSpeaking ? 'speaking' : ''}`}
                                    onClick={() => speak(word.word)}
                                    disabled={isSpeaking}
                                    title="Hear it"
                                >
                                    🔈
                                </button>
                            )}
                        </span>
                    </div>

                    {/* Masked answer */}
                    <div className="hangman-answer">
                        {[...target].map((ch, i) => {
                            if (ch === ' ') return <span key={i} className="answer-space" />;
                            const revealed = roundOver || isRevealed(ch);
                            const structural = isStructural(ch);
                            return (
                                <span
                                    key={i}
                                    className={`answer-tile ${structural ? 'structural' : ''} ${
                                        revealed ? 'revealed' : 'blank'
                                    } ${status === 'lost' && !isRevealed(ch) ? 'missed' : ''}`}
                                >
                                    {revealed ? ch : ''}
                                </span>
                            );
                        })}
                    </div>

                    {guessingIpa ? (
                        <div className="hangman-answer-readout">
                            {roundOver ? `/${word.ipa}/` : ' '}
                        </div>
                    ) : (
                        <div className="hangman-answer-readout">
                            {roundOver ? word.word : ' '}
                        </div>
                    )}

                    {/* Hint */}
                    {!roundOver && (
                        <button
                            className="hangman-hint-btn"
                            onClick={() => setShowHint((s) => !s)}
                        >
                            💡 {showHint ? word.hint : 'Show hint'}
                        </button>
                    )}

                    {/* Result */}
                    {roundOver && (
                        <div className={`hangman-result ${status}`}>
                            <h2>{status === 'won' ? theme.winTitle : theme.loseTitle}</h2>
                            <p className="result-detail">
                                {word.word} = <span className="result-ipa">/{word.ipa}/</span>
                            </p>
                            <button className="btn btn-primary" onClick={() => startRound()}>
                                Next Word →
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Guessing keyboard */}
            {!roundOver && (
                <div className="hangman-keyboard">
                    {guessingIpa ? (
                        <>
                            <KeyRow
                                label="Vowels"
                                symbols={ipaVowels}
                                guessed={guessed}
                                targetSymbols={targetSymbols}
                                onGuess={handleGuess}
                                type="vowel"
                            />
                            <KeyRow
                                label="Consonants"
                                symbols={ipaConsonants}
                                guessed={guessed}
                                targetSymbols={targetSymbols}
                                onGuess={handleGuess}
                                type="consonant"
                            />
                        </>
                    ) : (
                        <KeyRow
                            symbols={LETTERS}
                            guessed={guessed}
                            targetSymbols={targetSymbols}
                            onGuess={handleGuess}
                            type="letter"
                            upper
                        />
                    )}
                </div>
            )}

            <Confetti trigger={status === 'won' ? wins : 0} />
        </div>
    );
}

/** A labelled row of guess keys with hit/miss/disabled states. */
function KeyRow({ label, symbols, guessed, targetSymbols, onGuess, type, upper }) {
    return (
        <div className="key-row-group">
            {label && <span className="key-row-label">{label}</span>}
            <div className="key-row">
                {symbols.map((sym) => {
                    const isGuessed = guessed.has(sym);
                    const isHit = isGuessed && targetSymbols.has(sym);
                    const isMiss = isGuessed && !targetSymbols.has(sym);
                    return (
                        <button
                            key={sym}
                            className={`guess-key ${type} ${isHit ? 'hit' : ''} ${
                                isMiss ? 'miss' : ''
                            }`}
                            disabled={isGuessed}
                            onClick={() => onGuess(sym)}
                        >
                            {upper ? sym.toUpperCase() : sym}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default HangmanGame;
