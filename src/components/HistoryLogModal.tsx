/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, History, Swords, Dices, Home, ArrowRight } from 'lucide-react';
import { MoveHistoryItem, PlayerColor } from '../types/game';

interface HistoryLogModalProps {
  isOpen: boolean;
  history: MoveHistoryItem[];
  onClose: () => void;
}

const COLOR_DOTS: Record<PlayerColor, string> = {
  red: 'bg-rose-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  blue: 'bg-blue-500',
};

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({
  isOpen,
  history,
  onClose,
}) => {
  if (!isOpen) return null;

  const renderIcon = (action: MoveHistoryItem['action']) => {
    switch (action) {
      case 'capture':
        return <Swords className="w-3.5 h-3.5 text-rose-500" />;
      case 'home':
        return <Home className="w-3.5 h-3.5 text-emerald-500" />;
      case 'release':
        return <Dices className="w-3.5 h-3.5 text-amber-500" />;
      case 'move':
        return <ArrowRight className="w-3.5 h-3.5 text-blue-500" />;
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-800">Move History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No moves recorded yet.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="pt-2.5 first:pt-0 flex items-start gap-2.5 text-xs">
                <div className="flex items-center gap-1.5 mt-0.5 shrink-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${COLOR_DOTS[item.playerColor]}`} />
                  <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
                    {renderIcon(item.action)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-700 leading-snug">{item.message}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
