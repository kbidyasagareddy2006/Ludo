/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerColor } from '../types/game';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  disabled: boolean;
  activeColor: PlayerColor;
  onRoll: () => void;
  canRoll: boolean;
}

const COLOR_CLASSES: Record<PlayerColor, { bg: string; border: string; glow: string; text: string }> = {
  red: {
    bg: 'from-rose-500 to-red-600',
    border: 'border-red-400',
    glow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
    text: 'text-red-500',
  },
  green: {
    bg: 'from-emerald-500 to-green-600',
    border: 'border-emerald-400',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    text: 'text-emerald-500',
  },
  yellow: {
    bg: 'from-amber-400 to-yellow-500',
    border: 'border-amber-300',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.5)]',
    text: 'text-amber-500',
  },
  blue: {
    bg: 'from-blue-500 to-indigo-600',
    border: 'border-blue-400',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    text: 'text-blue-500',
  },
};

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  activeColor,
  onRoll,
  canRoll,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value || 1);
  const colorTheme = COLOR_CLASSES[activeColor];

  useEffect(() => {
    if (value !== null && !isRolling) {
      setDisplayValue(value);
    }
  }, [value, isRolling]);

  // Rolling pip shuffle animation
  useEffect(() => {
    if (!isRolling) return;
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
    }, 70);
    return () => clearInterval(interval);
  }, [isRolling]);

  // Render dice pips according to displayValue
  const renderPips = (val: number) => {
    // 3x3 grid dots layout:
    // 1: center
    // 2: top-right, bottom-left
    // 3: top-right, center, bottom-left
    // 4: 4 corners
    // 5: 4 corners + center
    // 6: 2 columns of 3
    const positions: Record<number, number[]> = {
      1: [4],
      2: [2, 6],
      3: [2, 4, 6],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };

    const activePips = positions[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-12 h-12 p-1.5 gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <div key={index} className="flex items-center justify-center">
            {activePips.includes(index) && (
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  val === 6 ? 'bg-amber-500 shadow-sm' : 'bg-slate-800'
                } transition-all duration-100`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          if (canRoll && !disabled && !isRolling) {
            onRoll();
          }
        }}
        disabled={disabled || !canRoll || isRolling}
        aria-label="Roll Dice"
        className={`relative group cursor-pointer focus:outline-none transition-all duration-300 transform select-none ${
          canRoll && !disabled
            ? 'hover:scale-105 active:scale-95'
            : 'opacity-70 cursor-not-allowed'
        }`}
      >
        {/* Glow halo when ready to roll */}
        {canRoll && !disabled && (
          <div
            className={`absolute -inset-2.5 rounded-2xl bg-gradient-to-r ${colorTheme.bg} opacity-75 blur-md animate-pulse`}
          />
        )}

        {/* Dice Body with 3D bevel and tactile border */}
        <div
          className={`relative w-20 h-20 rounded-2xl bg-white border-2 border-slate-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.18),inset_0_-4px_6px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center transition-all duration-200 ${
            isRolling ? 'rotate-12 scale-95 shadow-inner' : ''
          }`}
        >
          {renderPips(displayValue)}

          {/* Six indicator glow */}
          {displayValue === 6 && !isRolling && (
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 pointer-events-none animate-pulse" />
          )}
        </div>
      </button>

      {/* Helper caption */}
      <div className="mt-2 text-center h-5">
        {isRolling ? (
          <span className="text-xs font-semibold text-slate-500 animate-pulse tracking-wide">
            Rolling...
          </span>
        ) : canRoll && !disabled ? (
          <span className={`text-xs font-bold ${colorTheme.text} animate-bounce`}>
            Tap to Roll!
          </span>
        ) : value === 6 ? (
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Bonus Turn (Rolled 6)!
          </span>
        ) : (
          <span className="text-xs text-slate-500 font-medium">
            {value ? `Rolled: ${value}` : 'Waiting...'}
          </span>
        )}
      </div>
    </div>
  );
};
