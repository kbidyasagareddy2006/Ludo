/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Player, PlayerColor } from '../types/game';
import { Bot, Crown, Swords, Trophy } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  timeRemaining?: number;
  totalTime?: number;
  position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
}

const COLOR_STYLES: Record<
  PlayerColor,
  {
    border: string;
    bg: string;
    activeRing: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
  }
> = {
  red: {
    border: 'border-rose-300',
    bg: 'bg-rose-50/70',
    activeRing: 'ring-2 ring-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.35)]',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-white',
    accent: 'text-rose-600',
  },
  green: {
    border: 'border-emerald-300',
    bg: 'bg-emerald-50/70',
    activeRing: 'ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-white',
    accent: 'text-emerald-600',
  },
  yellow: {
    border: 'border-amber-300',
    bg: 'bg-amber-50/70',
    activeRing: 'ring-2 ring-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-white',
    accent: 'text-amber-600',
  },
  blue: {
    border: 'border-blue-300',
    bg: 'bg-blue-50/70',
    activeRing: 'ring-2 ring-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    badgeBg: 'bg-blue-500',
    badgeText: 'text-white',
    accent: 'text-blue-600',
  },
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  timeRemaining = 0,
  totalTime = 0,
}) => {
  const styles = COLOR_STYLES[player.color];

  // Token breakdown
  const homeCount = player.tokens.filter((t) => t.step === 56).length;
  const yardCount = player.tokens.filter((t) => t.step === -1).length;
  const inPlayCount = player.tokens.filter((t) => t.step >= 0 && t.step < 56).length;

  const timerPct = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  return (
    <div
      className={`relative flex flex-col p-2.5 rounded-2xl border transition-all duration-300 bg-white shadow-sm ${
        styles.border
      } ${isActive ? `${styles.activeRing} scale-[1.02] bg-white` : 'opacity-85'}`}
    >
      {/* Top Header: Avatar, Name, Type, Rank */}
      <div className="flex items-center justify-between gap-1.5 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Avatar Icon */}
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${styles.badgeBg} ${styles.badgeText} shadow-sm`}
          >
            {player.isAI ? (
              <Bot className="w-4 h-4" />
            ) : (
              <Crown className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs text-slate-800 truncate max-w-[85px] sm:max-w-[110px]">
                {player.name}
              </span>
              {player.isAI && (
                <span className="text-[10px] text-slate-400 capitalize">
                  ({player.aiDifficulty?.[0].toUpperCase()})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 capitalize leading-tight">
              {player.color}
            </div>
          </div>
        </div>

        {/* Rank or Captures Badge */}
        {player.hasWon && player.rank ? (
          <div className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
            <Trophy className="w-3.5 h-3.5" />
            <span>#{player.rank}</span>
          </div>
        ) : (
          player.capturesCount > 0 && (
            <div className="flex items-center gap-0.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
              <Swords className="w-3 h-3 text-rose-500" />
              <span>{player.capturesCount}</span>
            </div>
          )
        )}
      </div>

      {/* Token status counters */}
      <div className="grid grid-cols-3 gap-1 text-center bg-slate-50/80 rounded-xl p-1 text-[10px] border border-slate-100">
        <div>
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Base</span>
          <span className="font-bold text-slate-700">{yardCount}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Play</span>
          <span className="font-bold text-slate-700">{inPlayCount}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Home</span>
          <span className={`font-bold ${styles.accent}`}>{homeCount}/4</span>
        </div>
      </div>

      {/* Turn Timer bar if active */}
      {isActive && totalTime > 0 && (
        <div className="w-full bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${styles.badgeBg}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
      )}
    </div>
  );
};
