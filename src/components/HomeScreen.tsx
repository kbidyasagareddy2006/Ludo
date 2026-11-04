/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bot,
  Users,
  Play,
  RotateCcw,
  BookOpen,
  Settings,
  Sparkles,
  Trophy,
  Swords,
  Dices,
} from 'lucide-react';
import { AIDifficulty, GameMode, GameState } from '../types/game';
import { GameStats } from '../engine/storage';

interface HomeScreenProps {
  hasSavedGame: boolean;
  savedGameState: GameState | null;
  onResumeGame: () => void;
  onStartNewGame: (mode: GameMode, config: GameSetupConfig) => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  stats: GameStats;
}

export interface GameSetupConfig {
  humanName: string;
  aiCount: number;
  aiDifficulty: AIDifficulty;
  playerNames: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  hasSavedGame,
  savedGameState,
  onResumeGame,
  onStartNewGame,
  onOpenRules,
  onOpenSettings,
  stats,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('ai');

  // AI mode options
  const [humanName, setHumanName] = useState('Player 1');
  const [aiCount, setAiCount] = useState<number>(1);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium');

  // Local multiplayer names
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
  ]);

  const handleNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handleStartGame = () => {
    onStartNewGame(selectedMode, {
      humanName,
      aiCount,
      aiDifficulty,
      playerNames,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 selection:bg-amber-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
              Crown Ludo Classic
            </h1>
            <p className="text-xs text-slate-400">Accurate Tournament Rules & Smart AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRules}
            aria-label="View Rules"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>
          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl w-full mx-auto my-auto py-6 sm:py-8 space-y-6">
        {/* Saved Game Resume Banner */}
        {hasSavedGame && savedGameState && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-transparent border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-200">In-Progress Game Found</h3>
                <p className="text-xs text-slate-300">
                  {savedGameState.mode === 'ai' ? 'Vs AI' : 'Local Multiplayer'} · Turn:{' '}
                  {savedGameState.players[savedGameState.activePlayerIndex]?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onResumeGame}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Resume Match
            </button>
          </div>
        )}

        {/* 4 Mode Selection Cards */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Select Game Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Mode 1: AI vs Human */}
            <button
              onClick={() => setSelectedMode('ai')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                selectedMode === 'ai'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMode === 'ai'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <Sparkles
                  className={`w-4 h-4 ${
                    selectedMode === 'ai' ? 'text-amber-400' : 'text-slate-600'
                  }`}
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">AI vs Human</h3>
                <p className="text-[11px] text-slate-400">1 to 3 AI Opponents</p>
              </div>
            </button>

            {/* Mode 2: Local 2-Player */}
            <button
              onClick={() => setSelectedMode('local2')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                selectedMode === 'local2'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMode === 'local2'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">2 Players</h3>
                <p className="text-[11px] text-slate-400">Pass & Play Head-to-Head</p>
              </div>
            </button>

            {/* Mode 3: Local 3-Player */}
            <button
              onClick={() => setSelectedMode('local3')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                selectedMode === 'local3'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMode === 'local3'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">3 Players</h3>
                <p className="text-[11px] text-slate-400">Balanced 3-Way Battle</p>
              </div>
            </button>

            {/* Mode 4: Local 4-Player */}
            <button
              onClick={() => setSelectedMode('local4')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                selectedMode === 'local4'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedMode === 'local4'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">4 Players</h3>
                <p className="text-[11px] text-slate-400">Classic Full Board War</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mode-Specific Customization Panel */}
        <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/60 space-y-5">
          {selectedMode === 'ai' ? (
            <>
              {/* Human Player Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={humanName}
                  onChange={(e) => setHumanName(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Number of AI Opponents */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  AI Opponents Count
                </label>
                <div className="flex gap-2">
                  {[
                    { label: '1 Opponent (1v1)', count: 1 },
                    { label: '2 Opponents', count: 2 },
                    { label: '3 Opponents (4-way)', count: 3 },
                  ].map((item) => (
                    <button
                      key={item.count}
                      onClick={() => setAiCount(item.count)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        aiCount === item.count
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Difficulty */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  AI Difficulty
                </label>
                <div className="flex gap-2">
                  {[
                    { label: 'Easy (Casual)', diff: 'easy' as const },
                    { label: 'Medium (Standard)', diff: 'medium' as const },
                    { label: 'Hard (Mastermind)', diff: 'hard' as const },
                  ].map((item) => (
                    <button
                      key={item.diff}
                      onClick={() => setAiDifficulty(item.diff)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        aiDifficulty === item.diff
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                          : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Local Multiplayer Player Names Customization */
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Player Names
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({
                  length:
                    selectedMode === 'local2' ? 2 : selectedMode === 'local3' ? 3 : 4,
                }).map((_, idx) => {
                  const colors = ['Red', 'Yellow', 'Green', 'Blue'];
                  const colorBadges = [
                    'border-rose-500 text-rose-400',
                    'border-amber-500 text-amber-400',
                    'border-emerald-500 text-emerald-400',
                    'border-blue-500 text-blue-400',
                  ];
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold border px-2 py-1 rounded-lg ${colorBadges[idx]}`}
                      >
                        {colors[idx]}
                      </span>
                      <input
                        type="text"
                        maxLength={16}
                        value={playerNames[idx]}
                        onChange={(e) => handleNameChange(idx, e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                        placeholder={`Player ${idx + 1}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Launch Match Button */}
          <button
            onClick={handleStartGame}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Match
          </button>
        </div>

        {/* Quick Lifetime Stats Bar */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              Matches Played
            </div>
            <div className="text-lg font-black text-white">{stats.gamesPlayed}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3 text-amber-400" />
              Wins
            </div>
            <div className="text-lg font-black text-amber-300">{stats.gamesWon}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center">
            <div className="text-[10px] uppercase font-semibold text-slate-400 flex items-center justify-center gap-1">
              <Swords className="w-3 h-3 text-rose-400" />
              Captures
            </div>
            <div className="text-lg font-black text-rose-300">{stats.totalCaptures}</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-4 border-t border-slate-800/80">
        Crown Ludo Classic · Fair RNG Dice Engine & Safe Zones
      </footer>
    </div>
  );
};
