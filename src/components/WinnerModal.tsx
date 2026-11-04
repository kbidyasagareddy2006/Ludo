/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Crown, Swords } from 'lucide-react';
import { Player, PlayerColor } from '../types/game';

interface WinnerModalProps {
  isOpen: boolean;
  players: Player[];
  winnerRankings: PlayerColor[];
  onPlayAgain: () => void;
  onHomeMenu: () => void;
}

const COLOR_MAP: Record<PlayerColor, { name: string; bg: string; text: string; border: string }> = {
  red: { name: 'Red', bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-400' },
  green: { name: 'Green', bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-400' },
  yellow: { name: 'Yellow', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-400' },
  blue: { name: 'Blue', bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-400' },
};

export const WinnerModal: React.FC<WinnerModalProps> = ({
  isOpen,
  players,
  winnerRankings,
  onPlayAgain,
  onHomeMenu,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger colorful confetti celebration
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isOpen]);

  if (!isOpen) return null;

  const winnerColor = winnerRankings[0];
  const winnerPlayer = players.find((p) => p.color === winnerColor) || players[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 flex flex-col items-center">
        {/* Animated Trophy Icon */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-amber-950 animate-bounce" />
          </div>
          <Crown className="w-7 h-7 text-amber-500 absolute -top-3 -right-2 drop-shadow-sm" />
        </div>

        {/* Winner Announcement */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Victory!
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          <strong className={`font-bold ${COLOR_MAP[winnerPlayer.color].text}`}>
            {winnerPlayer.name}
          </strong>{' '}
          wins the match!
        </p>

        {/* Final Standings Leaderboard */}
        <div className="w-full mt-5 space-y-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Final Standings
          </div>
          {winnerRankings.map((color, index) => {
            const player = players.find((p) => p.color === color);
            if (!player) return null;
            const rank = index + 1;
            const isFirst = rank === 1;

            return (
              <div
                key={color}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                  isFirst
                    ? 'bg-amber-50/80 border-amber-300 font-bold text-slate-900'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                      isFirst
                        ? 'bg-amber-500 text-white'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-700'
                        : rank === 3
                        ? 'bg-amber-700/60 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    #{rank}
                  </div>
                  <span className="truncate max-w-[130px]">{player.name}</span>
                  <span className="text-[10px] text-slate-400 capitalize">({player.color})</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Swords className="w-3 h-3 text-rose-500" />
                    {player.capturesCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onHomeMenu}
            className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
          <button
            onClick={onPlayAgain}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
