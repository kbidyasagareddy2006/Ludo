/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  History,
  AlertCircle,
} from 'lucide-react';
import { GameSettings, GameState, PlayerColor } from '../types/game';
import {
  chooseAIMove,
  executeMove,
  getLegalTokenMoves,
  passTurn,
} from '../engine/ludoRules';
import { soundManager } from '../engine/sound';
import { saveGameState, updateStats } from '../engine/storage';
import { Board } from './Board';
import { Dice } from './Dice';
import { PlayerCard } from './PlayerCard';

interface GameScreenProps {
  gameState: GameState;
  settings: GameSettings;
  onUpdateState: (next: GameState) => void;
  onExitToHome: () => void;
  onRestartMatch: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onToggleSound: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  settings,
  onUpdateState,
  onExitToHome,
  onRestartMatch,
  onOpenRules,
  onOpenHistory,
  onToggleSound,
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(settings.turnTimerSeconds);

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const isAI = activePlayer?.isAI;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Speed multiplier for animations & AI thinking
  const delayMult = settings.animationSpeed === 'fast' ? 0.6 : 1;

  // Auto-save whenever game state changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Turn Timer countdown
  useEffect(() => {
    if (settings.turnTimerSeconds <= 0 || gameState.isGameOver) return;

    setTimeRemaining(settings.turnTimerSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired! If player has legal moves, auto-play one; else pass turn
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.activePlayerIndex, gameState.turnPhase, settings.turnTimerSeconds]);

  const handleTimeExpired = useCallback(() => {
    if (gameState.turnPhase === 'rolling') {
      // Auto-roll dice on timeout
      handleRollDice();
    } else if (gameState.turnPhase === 'moving') {
      if (gameState.legalMoves.length > 0) {
        // Auto-select first legal move
        handleSelectToken(gameState.legalMoves[0]);
      } else {
        const next = passTurn(gameState, 'no-moves');
        onUpdateState(next);
      }
    }
  }, [gameState]);

  // Dice roll handler
  const handleRollDice = useCallback(() => {
    if (isRolling || gameState.turnPhase !== 'rolling' || gameState.isGameOver) return;

    setIsRolling(true);
    soundManager.playDiceRoll();

    setTimeout(() => {
      // Fair random roll 1..6
      const rollValue = Math.floor(Math.random() * 6) + 1;
      setIsRolling(false);

      if (rollValue === 6) {
        updateStats((s) => ({ ...s, totalSixesRolled: s.totalSixesRolled + 1 }));
      }

      // Check 3 consecutive 6s tournament rule
      const nextConsecutive = rollValue === 6 ? gameState.consecutiveSixes + 1 : 0;
      if (nextConsecutive === 3) {
        soundManager.playClick();
        const next = passTurn(
          { ...gameState, currentDiceValue: rollValue, consecutiveSixes: 3 },
          'three-sixes'
        );
        onUpdateState(next);
        return;
      }

      // Calculate legal moves
      const moves = getLegalTokenMoves(activePlayer, rollValue);

      if (moves.length === 0) {
        // No legal moves: pass turn after short visual pause
        const intermediateState: GameState = {
          ...gameState,
          currentDiceValue: rollValue,
          consecutiveSixes: nextConsecutive,
          turnPhase: 'passed',
          legalMoves: [],
        };
        onUpdateState(intermediateState);

        setTimeout(() => {
          const next = passTurn(intermediateState, 'no-moves');
          onUpdateState(next);
        }, 900 * delayMult);
      } else {
        // Move phase
        const nextState: GameState = {
          ...gameState,
          currentDiceValue: rollValue,
          consecutiveSixes: nextConsecutive,
          turnPhase: 'moving',
          legalMoves: moves,
        };
        onUpdateState(nextState);
      }
    }, 550 * delayMult);
  }, [isRolling, gameState, activePlayer, delayMult, onUpdateState]);

  // Token move handler
  const handleSelectToken = useCallback(
    (tokenId: number) => {
      if (gameState.turnPhase !== 'moving' || !gameState.legalMoves.includes(tokenId)) return;

      try {
        const result = executeMove(gameState, tokenId);

        // Sound triggers based on outcome
        if (result.hasWon) {
          soundManager.playWinFanfare();
          updateStats((s) => ({
            ...s,
            gamesWon: activePlayer.isAI ? s.gamesWon : s.gamesWon + 1,
            gamesPlayed: s.gamesPlayed + 1,
          }));
        } else if (result.reachedHome) {
          soundManager.playHomeRun();
        } else if (result.captured) {
          soundManager.playTokenCapture();
          updateStats((s) => ({ ...s, totalCaptures: s.totalCaptures + 1 }));
        } else if (result.released) {
          soundManager.playTokenRelease();
        } else {
          soundManager.playTokenStep();
        }

        onUpdateState(result.nextState);
      } catch (err) {
        console.error('Failed to execute move', err);
      }
    },
    [gameState, activePlayer, onUpdateState]
  );

  // AI Turn Automator
  useEffect(() => {
    if (gameState.isGameOver || !isAI) return;

    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

    if (gameState.turnPhase === 'rolling' && !isRolling) {
      // AI rolls dice after thinking pause
      aiTimeoutRef.current = setTimeout(() => {
        handleRollDice();
      }, 750 * delayMult);
    } else if (gameState.turnPhase === 'moving') {
      // AI chooses move after roll evaluation pause
      aiTimeoutRef.current = setTimeout(() => {
        const chosenTokenId = chooseAIMove(
          gameState,
          gameState.activePlayerIndex,
          gameState.currentDiceValue!,
          activePlayer.aiDifficulty
        );
        if (chosenTokenId >= 0) {
          handleSelectToken(chosenTokenId);
        }
      }, 750 * delayMult);
    }

    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [
    gameState.activePlayerIndex,
    gameState.turnPhase,
    gameState.currentDiceValue,
    gameState.isGameOver,
    isAI,
    isRolling,
    delayMult,
    handleRollDice,
    handleSelectToken,
  ]);

  // Player position mapping on board (4 corners)
  const getPlayerPosition = (color: PlayerColor) => {
    switch (color) {
      case 'red':
        return 'top-left';
      case 'green':
        return 'top-right';
      case 'yellow':
        return 'bottom-right';
      case 'blue':
        return 'bottom-left';
    }
  };

  const latestHistory = gameState.history[0]?.message || 'Game in progress';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <header className="px-3 sm:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        {/* Back button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Menu</span>
        </button>

        {/* Live Action Ticker in Header */}
        <div className="flex-1 mx-2 sm:mx-4 max-w-sm sm:max-w-md text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-[11px] sm:text-xs text-slate-300 truncate max-w-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{latestHistory}</span>
          </div>
        </div>

        {/* Quick Actions (Sound, Rules, History, Reset) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
          <button
            onClick={onOpenHistory}
            aria-label="Move History"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenRules}
            aria-label="Rules"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowRestartConfirm(true)}
            aria-label="Restart Match"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 gap-4 max-w-6xl w-full mx-auto">
        {/* Left Side (Desktop): Player 1 (Red) and Player 4 (Blue) */}
        <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
          {gameState.players
            .filter((p) => p.color === 'red' || p.color === 'blue')
            .map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={player.id === activePlayer.id}
                timeRemaining={timeRemaining}
                totalTime={settings.turnTimerSeconds}
                position={getPlayerPosition(player.color)}
              />
            ))}
        </div>

        {/* Center: Top Player Bar (Mobile) + Board + Bottom Controls */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg">
          {/* Top Players Row for Mobile */}
          <div className="lg:hidden grid grid-cols-2 gap-2 w-full mb-2">
            {gameState.players.slice(0, 2).map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={player.id === activePlayer.id}
                timeRemaining={timeRemaining}
                totalTime={settings.turnTimerSeconds}
                position={getPlayerPosition(player.color)}
              />
            ))}
          </div>

          {/* 15x15 Ludo Board */}
          <div className="w-full flex items-center justify-center">
            <Board
              players={gameState.players}
              activeColor={activePlayer.color}
              legalMoves={gameState.legalMoves}
              turnPhase={gameState.turnPhase}
              onSelectToken={handleSelectToken}
            />
          </div>

          {/* Bottom Players Row for Mobile (if 3 or 4 players) */}
          {gameState.players.length > 2 && (
            <div className="lg:hidden grid grid-cols-2 gap-2 w-full mt-2">
              {gameState.players.slice(2).map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isActive={player.id === activePlayer.id}
                  timeRemaining={timeRemaining}
                  totalTime={settings.turnTimerSeconds}
                  position={getPlayerPosition(player.color)}
                />
              ))}
            </div>
          )}

          {/* Active Turn Controller (Dice & Prompt) */}
          <div className="w-full mt-3 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4">
            {/* Active Player Info */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  activePlayer.color === 'red'
                    ? 'bg-rose-500'
                    : activePlayer.color === 'green'
                    ? 'bg-emerald-500'
                    : activePlayer.color === 'yellow'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                } animate-pulse`}
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{activePlayer.name}&apos;s Turn</span>
                  {activePlayer.isAI && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      (AI Thinking...)
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {gameState.turnPhase === 'rolling'
                    ? 'Roll the dice to continue'
                    : gameState.turnPhase === 'moving'
                    ? activePlayer.isAI
                      ? 'AI selecting token...'
                      : 'Tap highlighted token to move'
                    : 'No legal moves'}
                </div>
              </div>
            </div>

            {/* 3D Interactive Animated Dice */}
            <Dice
              value={gameState.currentDiceValue}
              isRolling={isRolling}
              disabled={isAI || gameState.isGameOver}
              activeColor={activePlayer.color}
              onRoll={handleRollDice}
              canRoll={gameState.turnPhase === 'rolling'}
            />
          </div>
        </div>

        {/* Right Side (Desktop): Player 2 (Green) and Player 3 (Yellow) */}
        <div className="hidden lg:flex flex-col gap-4 w-52 shrink-0">
          {gameState.players
            .filter((p) => p.color === 'green' || p.color === 'yellow')
            .map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={player.id === activePlayer.id}
                timeRemaining={timeRemaining}
                totalTime={settings.turnTimerSeconds}
                position={getPlayerPosition(player.color)}
              />
            ))}
        </div>
      </main>

      {/* Confirmation Modal: Restart Match */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-1">Restart Match?</h3>
            <p className="text-xs text-slate-500 mb-5">
              This will reset the current game board and all token positions.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRestartConfirm(false);
                  onRestartMatch();
                }}
                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                Yes, Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Exit to Menu */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-slate-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base mb-1">Exit to Main Menu?</h3>
            <p className="text-xs text-slate-500 mb-5">
              Your match progress is automatically saved and can be resumed anytime.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExitToHome();
                }}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Exit to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
