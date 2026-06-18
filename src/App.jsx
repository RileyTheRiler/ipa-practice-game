import { useState } from 'react';
import GamePicker from './components/GamePicker';
import QuizMenu from './components/QuizMenu';
import MultipleChoiceGame from './components/MultipleChoiceGame';
import HangmanGame from './components/HangmanGame';
import ResultsScreen from './components/ResultsScreen';
import TimedMode from './components/TimedMode';
import LearnMode from './components/LearnMode';
import LiveCaptionMode from './components/LiveCaptionMode';
import './index.css';

function App() {
    const [screen, setScreen] = useState('home');
    const [gameMode, setGameMode] = useState('wordToIpa');
    const [currentLevel, setCurrentLevel] = useState('level1');
    const [results, setResults] = useState(null);
    // Remember where Live Captions was opened from, so "Back" returns there.
    const [liveCaptionFrom, setLiveCaptionFrom] = useState('home');

    /** Open the live-caption screen, remembering the originating screen. */
    const openLiveCaption = (from) => {
        setLiveCaptionFrom(from);
        setScreen('liveCaption');
    };

    /** Configure and launch a quiz session. */
    const startQuiz = (mode, level) => {
        setGameMode(mode);
        setCurrentLevel(level);
        setScreen('quizGame');
    };

    /** Pick the component for the active screen. */
    const renderScreen = () => {
        switch (screen) {
            case 'home':
                return (
                    <GamePicker
                        onPickLiveCaption={() => openLiveCaption('home')}
                    />
                );

            case 'hangman':
                return <HangmanGame onBack={() => setScreen('home')} />;

            case 'quizMenu':
                return (
                    <QuizMenu
                        onStartGame={startQuiz}
                        onStartTimedMode={() => setScreen('timed')}
                        onOpenLearnMode={() => setScreen('learn')}
                        onOpenLiveCaption={() => openLiveCaption('quizMenu')}
                        onBack={() => setScreen('home')}
                    />
                );

            case 'quizGame':
                return (
                    <MultipleChoiceGame
                        gameMode={gameMode}
                        currentLevel={currentLevel}
                        onEndGame={(stats) => {
                            setResults(stats);
                            setScreen('results');
                        }}
                        onBack={() => setScreen('quizMenu')}
                    />
                );

            case 'timed':
                return (
                    <TimedMode
                        onEnd={() => setScreen('quizMenu')}
                        onBack={() => setScreen('quizMenu')}
                    />
                );

            case 'learn':
                return <LearnMode onBack={() => setScreen('quizMenu')} />;

            case 'liveCaption':
                return <LiveCaptionMode onBack={() => setScreen(liveCaptionFrom)} />;

            case 'results':
                return (
                    <ResultsScreen
                        score={results?.score ?? 0}
                        correctAnswers={results?.correctCount ?? 0}
                        wrongAnswers={results?.wrongCount ?? 0}
                        bestStreak={results?.bestStreak ?? 0}
                        onPlayAgain={() => startQuiz(gameMode, currentLevel)}
                        onBackToMenu={() => setScreen('quizMenu')}
                    />
                );

            default:
                return (
                    <GamePicker
                        onPickLiveCaption={() => openLiveCaption('home')}
                    />
                );
        }
    };

    return <div className="app">{renderScreen()}</div>;
}

export default App;
