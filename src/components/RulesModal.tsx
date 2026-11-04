/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Dices, Shield, Swords, Home, RotateCcw } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              ?
            </div>
            <h2 className="text-lg font-bold text-slate-800">Ludo Rules & Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-sm">
          {/* Rule 1 */}
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100 mt-0.5">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">1. Releasing Tokens (Roll 6)</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                All 4 tokens begin in your Yard. You must roll a <strong className="text-slate-900">6</strong> to release a token onto your starting square. Rolling a 6 also awards an extra roll!
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 mt-0.5">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">2. Safe Star Squares</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Cells marked with a golden <strong className="text-amber-600">Star ★</strong> and each player's colored starting cell are Safe Zones. Tokens on safe cells cannot be captured by opponents, and multiple tokens can coexist peacefully.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">3. Capturing Opponents</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Landing on an unsafe square occupied by an opponent sends their token back to their Yard! The player who performed the capture is granted an immediate bonus roll.
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 mt-0.5">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">4. Home Path & Exact Count</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                After completing a full circuit of the board, tokens enter their private colored Home Path. You must roll the <strong className="text-slate-900">exact count</strong> to reach the center triangle. Each token entering Home awards a bonus roll!
              </p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 mt-0.5">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">5. Three Consecutive Sixes Rule</h3>
              <p className="text-slate-600 text-xs mt-0.5">
                Rolling 6 gives you an extra turn. However, if you roll three 6s in a row, the third roll is forfeited and the turn immediately passes to the next player.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
