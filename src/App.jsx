import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import TitleScreen from './components/TitleScreen';
import MenuScreen from './components/MenuScreen';
import MultipleChoiceGame from './components/MultipleChoiceGame';
import ResultsScreen from './components/ResultsScreen';
import TimedMode from './components/TimedMode';
import LearnMode from './components/LearnMode';
import { AchievementToastQueue } from './components/AchievementToast';
import { checkAchievements } from './data/achievements';
import './index.css';

function App() {
  const {
    state,
    goToScreen,
    startGame,
    updateInput,
    addToInput,
    backspace,
    clearInput,
    submitAnswer,
    nextWord,
    endGame,
    resetProgress,
  } = useGameState();

  const [currentScreen, setCurrentScreen] = useState(state.screen);
  const [newAchievements, setNewAchievements] = useState([]);

  // Sync screen state
  useEffect(() => {
    setCurrentScreen(state.screen);
  }, [state.screen]);

  // Check for achievements after each answer
  useEffect(() => {
    if (state.showFeedback) {
      const unlocked = checkAchievements(state);
      if (unlocked.length > 0) {
        setNewAchievements(unlocked);
      }
    }
  }, [state.showFeedback, state]);

  const handleStartTimedMode = () => {
    setCurrentScreen('timed');
  };

  const handleStartDailyChallenge = () => {
    // For now, start a regular game with mixed levels
    startGame('wordToIpa', 'level1');
  };

  const handleOpenLearnMode = () => {
    setCurrentScreen('learn');
  };

  const handleTimedModeEnd = (score, correctCount) => {
    // Check achievements for timed mode
    const unlocked = checkAchievements({
      ...state,
      timedModeScore: correctCount
    });
    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
    }
    setCurrentScreen('menu');
  };

  const handleAchievementComplete = () => {
    setNewAchievements([]);
  };

  // Render based on current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'title':
        return (
          <TitleScreen
            onStart={() => goToScreen('menu')}
          />
        );

      case 'menu':
        return (
          <MenuScreen
            onStartGame={startGame}
            onStartTimedMode={handleStartTimedMode}
            onStartDailyChallenge={handleStartDailyChallenge}
            onOpenLearnMode={handleOpenLearnMode}
            unlockedLevels={state.unlockedLevels}
            levelProgress={state.levelProgress}
            bestStreak={state.bestStreak}
            onResetProgress={resetProgress}
          />
        );

      case 'game':
        return (
          <MultipleChoiceGame
            gameMode={state.gameMode}
            currentLevel={state.currentLevel}
            onScoreUpdate={(stats) => {
              // Update state with new stats if needed
            }}
            onEndGame={endGame}
            onBack={() => goToScreen('menu')}
          />
        );

      case 'timed':
        return (
          <TimedMode
            onEnd={handleTimedModeEnd}
            onBack={() => setCurrentScreen('menu')}
          />
        );

      case 'learn':
        return (
          <LearnMode
            onBack={() => setCurrentScreen('menu')}
          />
        );

      case 'results':
        return (
          <ResultsScreen
            score={state.score}
            correctAnswers={state.correctAnswers}
            wrongAnswers={state.wrongAnswers}
            bestStreak={state.bestStreak}
            currentLevel={state.currentLevel}
            levelProgress={state.levelProgress}
            onPlayAgain={() => startGame(state.gameMode, state.currentLevel)}
            onBackToMenu={() => goToScreen('menu')}
          />
        );

      default:
        return <TitleScreen onStart={() => goToScreen('menu')} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
      <AchievementToastQueue
        achievements={newAchievements}
        onComplete={handleAchievementComplete}
      />
    </div>
  );
}

export default App;

