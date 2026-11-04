/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { GameMode, GameSettings, GameState } from './types/game';
import { createNewGameState } from './engine/ludoRules';
import { soundManager } from './engine/sound';
import {
  clearSavedGameState,
  DEFAULT_SETTINGS,
  loadSavedGameState,
  loadSettings,
  loadStats,
  saveSettings,
  GameStats,
} from './engine/storage';
import { HomeScreen, GameSetupConfig } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { HistoryLogModal } from './components/HistoryLogModal';
import { WinnerModal } from './components/WinnerModal';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game'>('home');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [savedGameState, setSavedGameState] = useState<GameState | null>(null);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    totalCaptures: 0,
    totalSixesRolled: 0,
  });

  // Modal states
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWinnerOpen, setIsWinnerOpen] = useState(false);

  // Load initial settings, stats, and saved match on startup
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    soundManager.setMuted(!loadedSettings.soundEnabled);

    setStats(loadStats());

    const saved = loadSavedGameState();
    if (saved && !saved.isGameOver) {
      setSavedGameState(saved);
    }
  }, []);

  // Check for game over to trigger victory celebration
  useEffect(() => {
    if (gameState?.isGameOver && gameState.winnerRankings.length > 0) {
      setIsWinnerOpen(true);
    }
  }, [gameState?.isGameOver, gameState?.winnerRankings]);

  // Handle sound toggle
  const handleToggleSound = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    const newSettings = { ...settings, soundEnabled: !newMuted };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings]);

  // Handle settings update
  const handleUpdateSettings = useCallback(
    (newSettings: GameSettings) => {
      setSettings(newSettings);
      soundManager.setMuted(!newSettings.soundEnabled);
      saveSettings(newSettings);
    },
    []
  );

  // Resume saved game
  const handleResumeGame = useCallback(() => {
    if (savedGameState) {
      soundManager.playClick();
      setGameState(savedGameState);
      setScreen('game');
    }
  }, [savedGameState]);

  // Start new match
  const handleStartNewGame = useCallback(
    (mode: GameMode, config: GameSetupConfig) => {
      soundManager.playClick();
      clearSavedGameState();

      const newState = createNewGameState(mode, {
        humanName: config.humanName,
        aiCount: config.aiCount,
        aiDifficulty: config.aiDifficulty,
        playerNames: config.playerNames,
      });

      setGameState(newState);
      setSavedGameState(newState);
      setScreen('game');
    },
    []
  );

  // Restart current match with fresh state
  const handleRestartMatch = useCallback(() => {
    if (!gameState) return;
    soundManager.playClick();
    clearSavedGameState();

    const restarted = createNewGameState(gameState.mode, {
      playerNames: gameState.players.map((p) => p.name),
      aiDifficulty: gameState.players.find((p) => p.isAI)?.aiDifficulty,
    });

    setGameState(restarted);
    setSavedGameState(restarted);
    setIsWinnerOpen(false);
  }, [gameState]);

  // Exit back to main home menu
  const handleExitToHome = useCallback(() => {
    soundManager.playClick();
    setStats(loadStats());
    setSavedGameState(loadSavedGameState());
    setIsWinnerOpen(false);
    setScreen('home');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased text-slate-100">
      {screen === 'home' || !gameState ? (
        <HomeScreen
          hasSavedGame={!!savedGameState}
          savedGameState={savedGameState}
          onResumeGame={handleResumeGame}
          onStartNewGame={handleStartNewGame}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          stats={stats}
        />
      ) : (
        <GameScreen
          gameState={gameState}
          settings={settings}
          onUpdateState={(next) => setGameState(next)}
          onExitToHome={handleExitToHome}
          onRestartMatch={handleRestartMatch}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Shared Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      {gameState && (
        <>
          <HistoryLogModal
            isOpen={isHistoryOpen}
            history={gameState.history}
            onClose={() => setIsHistoryOpen(false)}
          />

          <WinnerModal
            isOpen={isWinnerOpen}
            players={gameState.players}
            winnerRankings={gameState.winnerRankings}
            onPlayAgain={handleRestartMatch}
            onHomeMenu={handleExitToHome}
          />
        </>
      )}
    </div>
  );
}
