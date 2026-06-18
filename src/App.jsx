import { useState } from 'react';
import TitleScreen from './components/TitleScreen';
import GamePicker from './components/GamePicker';
import QuizMenu from './components/QuizMenu';
import MultipleChoiceGame from './components/MultipleChoiceGame';
import HangmanGame from './components/HangmanGame';
import ResultsScreen from './components/ResultsScreen';
import TimedMode from './components/TimedMode';
import LearnMode from './components/LearnMode';
import './index.css';

function App() {
    const [screen, setScreen] = useState('title');
    const [gameMode, setGameMode] = useState('wordToIpa');
    const [currentLevel, setCurrentLevel] = useState('level1');
    const [results, setResults] = useState(null);

    /** Configure and launch a quiz session. */
    const startQuiz = (mode, level) => {
        setGameMode(mode);
        setCurrentLevel(level);
        setScreen('quizGame');
    };

    /** Pick the component for the active screen. */
    const renderScreen = () => {
        switch (screen) {
            case 'title':
                return <TitleScreen onStart={() => setScreen('home')} />;

            case 'home':
                return (
                    <GamePicker
                        onPickHangman={() => setScreen('hangman')}
                        onPickQuiz={() => setScreen('quizMenu')}
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
                return <TitleScreen onStart={() => setScreen('home')} />;
        }
    };

    return <div className="app">{renderScreen()}</div>;
}

export default App;
