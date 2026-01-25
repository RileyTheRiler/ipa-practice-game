import { useState, useMemo } from 'react';
import { ipaCategories, getSymbolType } from '../data/ipaSymbols';
import { getPhoneticExplanation } from '../utils/ipaCompare';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import '../styles/symbolTutorial.css';

/**
 * SymbolTutorial component
 * Educational modal showing detailed information about an IPA symbol
 */
export function SymbolTutorial({ symbol, onClose }) {
    const { speak, isSpeaking, isSupported } = useSpeechSynthesis();

    const symbolInfo = useMemo(() => {
        if (!symbol) return null;

        // Get basic info from our phonetic explanation
        const explanation = getPhoneticExplanation(symbol);

        // Find detailed info from ipaCategories
        let detailedInfo = null;
        let category = null;

        // Search vowels
        for (const [subCat, symbols] of Object.entries(ipaCategories.vowels || {})) {
            const found = symbols.find(s => s.symbol === symbol);
            if (found) {
                detailedInfo = found;
                category = { type: 'vowel', subCategory: subCat };
                break;
            }
        }

        // Search consonants
        if (!detailedInfo) {
            for (const [subCat, symbols] of Object.entries(ipaCategories.consonants || {})) {
                const found = symbols.find(s => s.symbol === symbol);
                if (found) {
                    detailedInfo = found;
                    category = { type: 'consonant', subCategory: subCat };
                    break;
                }
            }
        }

        // Search diacritics
        if (!detailedInfo) {
            for (const [subCat, symbols] of Object.entries(ipaCategories.diacritics || {})) {
                const found = symbols.find(s => s.symbol === symbol);
                if (found) {
                    detailedInfo = found;
                    category = { type: 'diacritic', subCategory: subCat };
                    break;
                }
            }
        }

        // Search diphthongs
        if (!detailedInfo) {
            const found = (ipaCategories.diphthongs || []).find(s => s.symbol === symbol);
            if (found) {
                detailedInfo = found;
                category = { type: 'diphthong', subCategory: 'diphthong' };
            }
        }

        return {
            symbol,
            explanation,
            detailedInfo,
            category,
            type: getSymbolType(symbol),
        };
    }, [symbol]);

    if (!symbol || !symbolInfo) {
        return null;
    }

    const playExample = (word) => {
        if (isSupported) {
            speak(word);
        }
    };

    return (
        <div className="symbol-tutorial-overlay" onClick={onClose}>
            <div className="symbol-tutorial-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>

                {/* Main Symbol Display */}
                <div className="tutorial-header">
                    <div className={`symbol-display ${symbolInfo.type}`}>
                        {symbol}
                    </div>
                    <div className="symbol-meta">
                        <span className={`type-badge ${symbolInfo.type}`}>
                            {symbolInfo.type}
                        </span>
                        {symbolInfo.category && (
                            <span className="category-badge">
                                {symbolInfo.category.subCategory}
                            </span>
                        )}
                    </div>
                </div>

                {/* Name and Description */}
                <div className="tutorial-section">
                    <h3 className="section-title">{symbolInfo.explanation.name}</h3>
                    <p className="section-content">{symbolInfo.explanation.tip}</p>
                </div>

                {/* Example Word */}
                {symbolInfo.detailedInfo?.example && (
                    <div className="tutorial-section">
                        <h4 className="section-label">Example Word</h4>
                        <div className="example-word-card">
                            <span className="example-word">
                                {symbolInfo.detailedInfo.example}
                            </span>
                            {isSupported && (
                                <button
                                    className={`speak-btn ${isSpeaking ? 'speaking' : ''}`}
                                    onClick={() => playExample(symbolInfo.detailedInfo.example)}
                                    disabled={isSpeaking}
                                >
                                    {isSpeaking ? '🔊' : '🔈'} Hear it
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Mouth Position Guide */}
                <div className="tutorial-section">
                    <h4 className="section-label">How to Pronounce</h4>
                    <div className="pronunciation-guide">
                        {symbolInfo.type === 'vowel' && (
                            <div className="mouth-tips">
                                <div className="tip-item">
                                    <span className="tip-icon">👄</span>
                                    <span>
                                        {symbolInfo.category?.subCategory === 'front'
                                            ? 'Tongue positioned at front of mouth'
                                            : symbolInfo.category?.subCategory === 'back'
                                                ? 'Tongue positioned at back of mouth'
                                                : 'Tongue in neutral/central position'}
                                    </span>
                                </div>
                                <div className="tip-item">
                                    <span className="tip-icon">📏</span>
                                    <span>
                                        {symbolInfo.explanation.name?.includes('close')
                                            ? 'Mouth nearly closed'
                                            : symbolInfo.explanation.name?.includes('open')
                                                ? 'Mouth wide open'
                                                : 'Mouth at mid-height'}
                                    </span>
                                </div>
                            </div>
                        )}
                        {symbolInfo.type === 'consonant' && (
                            <div className="mouth-tips">
                                <div className="tip-item">
                                    <span className="tip-icon">🎯</span>
                                    <span>
                                        {symbolInfo.explanation.name?.includes('bilabial')
                                            ? 'Made with both lips'
                                            : symbolInfo.explanation.name?.includes('dental')
                                                ? 'Tongue between or behind teeth'
                                                : symbolInfo.explanation.name?.includes('velar')
                                                    ? 'Back of tongue touches soft palate'
                                                    : symbolInfo.explanation.name?.includes('alveolar')
                                                        ? 'Tongue touches ridge behind upper teeth'
                                                        : 'Check the articulation point'}
                                    </span>
                                </div>
                                <div className="tip-item">
                                    <span className="tip-icon">🔊</span>
                                    <span>
                                        {symbolInfo.explanation.name?.includes('voiceless')
                                            ? 'Voiceless - no throat vibration'
                                            : symbolInfo.explanation.name?.includes('voiced')
                                                ? 'Voiced - feel your throat vibrate'
                                                : 'Focus on the manner of articulation'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Common Words */}
                <div className="tutorial-section">
                    <h4 className="section-label">Practice Words</h4>
                    <div className="practice-words">
                        {getPracticeWords(symbol).map((word, idx) => (
                            <button
                                key={idx}
                                className="practice-word-btn"
                                onClick={() => playExample(word)}
                            >
                                {word}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Get practice words for a symbol
 */
function getPracticeWords(symbol) {
    const wordMap = {
        // Vowels
        'i': ['see', 'free', 'tree', 'deep', 'week'],
        'ɪ': ['sit', 'big', 'fish', 'mit', 'kid'],
        'e': ['say', 'day', 'make', 'late', 'great'],
        'ɛ': ['bed', 'red', 'set', 'pet', 'let'],
        'æ': ['cat', 'bat', 'hat', 'black', 'back'],
        'ə': ['about', 'sofa', 'the', 'away', 'again'],
        'ʌ': ['but', 'cup', 'up', 'love', 'come'],
        'u': ['food', 'moon', 'soon', 'pool', 'cool'],
        'ʊ': ['book', 'look', 'good', 'put', 'should'],
        'ɑ': ['father', 'hot', 'calm', 'palm', 'spa'],
        'ɔ': ['caught', 'law', 'bought', 'thought', 'all'],

        // Consonants
        'θ': ['think', 'three', 'through', 'thank', 'bath'],
        'ð': ['this', 'that', 'the', 'with', 'breathe'],
        'ʃ': ['ship', 'fish', 'shoe', 'push', 'wash'],
        'ʒ': ['measure', 'vision', 'leisure', 'treasure', 'beige'],
        'ŋ': ['sing', 'ring', 'thing', 'long', 'strong'],
        'ɹ': ['red', 'run', 'rain', 'right', 'grow'],
        'tʃ': ['church', 'watch', 'match', 'chin', 'cheap'],
        'dʒ': ['judge', 'bridge', 'jump', 'joy', 'age'],
    };

    return wordMap[symbol] || ['Practice with example word above'];
}

export default SymbolTutorial;
