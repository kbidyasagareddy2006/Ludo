/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Volume2, VolumeX, Timer, Zap, Check } from 'lucide-react';
import { GameSettings } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h2 className="text-lg font-bold text-slate-800">Game Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-slate-800">Sound Effects</div>
                <div className="text-xs text-slate-500">Dice roll, moves, captures & fanfares</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform absolute top-0.5 ${
                  settings.soundEnabled ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Turn Timer Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-slate-500" />
              <div className="font-semibold text-slate-800">Turn Timer</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Off', val: 0 },
                { label: '15s (Blitz)', val: 15 },
                { label: '30s (Classic)', val: 30 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => onUpdateSettings({ ...settings, turnTimerSeconds: opt.val })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    settings.turnTimerSeconds === opt.val
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {settings.turnTimerSeconds === opt.val && <Check className="w-3.5 h-3.5" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Animation Speed Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-slate-500" />
              <div className="font-semibold text-slate-800">Gameplay Speed</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Normal (Relaxed)', val: 'normal' as const },
                { label: 'Fast (Turbo)', val: 'fast' as const },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => onUpdateSettings({ ...settings, animationSpeed: opt.val })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                    settings.animationSpeed === opt.val
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {settings.animationSpeed === opt.val && <Check className="w-3.5 h-3.5" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
