import { useState } from 'react';
import SymbolTutorial from './SymbolTutorial';
import { ipaCategories, allIPASymbols, getSymbolType } from '../data/ipaSymbols';
import { minimalPairs } from '../data/minimalPairs';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import '../styles/learnMode.css';

/**
 * LearnMode component
 * Educational hub for IPA symbol tutorials and minimal pairs practice
 */
export function LearnMode({ onBack }) {
    const [activeTab, setActiveTab] = useState('symbols'); // 'symbols', 'pairs'
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [selectedPair, setSelectedPair] = useState(null);
    const { speak, isSpeaking, isSupported } = useSpeechSynthesis();

    const tabs = [
        { id: 'symbols', label: 'Symbol Library', icon: '🔤' },
        { id: 'pairs', label: 'Minimal Pairs', icon: '👂' },
    ];

    return (
        <div className="learn-mode-container">
            {/* Header */}
            <header className="learn-mode-header">
                <button className="back-button" onClick={onBack}>
                    ← Back to Menu
                </button>
                <h1 className="learn-title">📚 Learn Mode</h1>
            </header>

            {/* Tab Navigation */}
            <div className="learn-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Symbol Library Tab */}
            {activeTab === 'symbols' && (
                <div className="symbols-tab">
                    <p className="tab-description">
                        Tap any symbol to learn about its pronunciation
                    </p>

                    {/* Vowels Section */}
                    <section className="symbol-section">
                        <h2 className="section-heading vowel">Vowels</h2>
                        <div className="symbol-grid">
                            {Object.entries(ipaCategories.vowels || {}).map(([category, symbols]) => (
                                symbols.map(s => (
                                    <button
                                        key={s.symbol}
                                        className="symbol-tile vowel"
                                        onClick={() => setSelectedSymbol(s.symbol)}
                                        title={s.name}
                                    >
                                        <span className="tile-symbol">{s.symbol}</span>
                                        <span className="tile-example">{s.example}</span>
                                    </button>
                                ))
                            ))}
                        </div>
                    </section>

                    {/* Consonants Section */}
                    <section className="symbol-section">
                        <h2 className="section-heading consonant">Consonants</h2>
                        <div className="symbol-grid">
                            {Object.entries(ipaCategories.consonants || {}).map(([category, symbols]) => (
                                symbols.map(s => (
                                    <button
                                        key={s.symbol}
                                        className="symbol-tile consonant"
                                        onClick={() => setSelectedSymbol(s.symbol)}
                                        title={s.name}
                                    >
                                        <span className="tile-symbol">{s.symbol}</span>
                                        <span className="tile-example">{s.example}</span>
                                    </button>
                                ))
                            ))}
                        </div>
                    </section>

                    {/* Diphthongs Section */}
                    <section className="symbol-section">
                        <h2 className="section-heading vowel">Diphthongs</h2>
                        <div className="symbol-grid">
                            {(ipaCategories.diphthongs || []).map(s => (
                                <button
                                    key={s.symbol}
                                    className="symbol-tile vowel"
                                    onClick={() => setSelectedSymbol(s.symbol)}
                                    title={s.name}
                                >
                                    <span className="tile-symbol">{s.symbol}</span>
                                    <span className="tile-example">{s.example}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Diacritics Section */}
                    <section className="symbol-section">
                        <h2 className="section-heading diacritic">Diacritics</h2>
                        <div className="symbol-grid">
                            {Object.entries(ipaCategories.diacritics || {}).map(([category, symbols]) => (
                                symbols.map(s => (
                                    <button
                                        key={s.symbol}
                                        className="symbol-tile diacritic"
                                        onClick={() => setSelectedSymbol(s.symbol)}
                                        title={s.name}
                                    >
                                        <span className="tile-symbol">{s.symbol}</span>
                                        <span className="tile-example">{s.example}</span>
                                    </button>
                                ))
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {/* Minimal Pairs Tab */}
            {activeTab === 'pairs' && (
                <div className="pairs-tab">
                    <p className="tab-description">
                        Practice distinguishing similar sounds with minimal pairs
                    </p>

                    <div className="pairs-grid">
                        {minimalPairs.map(pair => (
                            <div
                                key={pair.id}
                                className={`pair-card ${pair.difficulty}`}
                                onClick={() => setSelectedPair(pair)}
                            >
                                <div className="pair-symbols">
                                    <span className="pair-symbol">{pair.pair[0]}</span>
                                    <span className="vs">vs</span>
                                    <span className="pair-symbol">{pair.pair[1]}</span>
                                </div>
                                <h3 className="pair-name">{pair.name}</h3>
                                <p className="pair-description">{pair.description}</p>
                                <span className={`difficulty-badge ${pair.difficulty}`}>
                                    {pair.difficulty}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Symbol Tutorial Modal */}
            {selectedSymbol && (
                <SymbolTutorial
                    symbol={selectedSymbol}
                    onClose={() => setSelectedSymbol(null)}
                />
            )}

            {/* Minimal Pair Detail Modal */}
            {selectedPair && (
                <div className="modal-overlay" onClick={() => setSelectedPair(null)}>
                    <div className="modal-content pair-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedPair(null)}>×</button>

                        <div className="pair-modal-header">
                            <div className="pair-symbols large">
                                <span className="pair-symbol">{selectedPair.pair[0]}</span>
                                <span className="vs">vs</span>
                                <span className="pair-symbol">{selectedPair.pair[1]}</span>
                            </div>
                            <h2>{selectedPair.name}</h2>
                            <p>{selectedPair.description}</p>
                        </div>

                        <div className="pair-examples">
                            <h3>Example Pairs</h3>
                            <div className="examples-list">
                                {selectedPair.examples.map((ex, idx) => (
                                    <div key={idx} className="example-row">
                                        <button
                                            className="word-btn"
                                            onClick={() => isSupported && speak(ex.words[0])}
                                        >
                                            {ex.words[0]}
                                            <span className="ipa">/{ex.ipa[0]}/</span>
                                        </button>
                                        <span className="vs-small">vs</span>
                                        <button
                                            className="word-btn"
                                            onClick={() => isSupported && speak(ex.words[1])}
                                        >
                                            {ex.words[1]}
                                            <span className="ipa">/{ex.ipa[1]}/</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pair-tips">
                            <h3>Tips</h3>
                            <ul>
                                {selectedPair.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LearnMode;
