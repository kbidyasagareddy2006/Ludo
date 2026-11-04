/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameSettings, GameState } from '../types/game';

const GAME_SAVE_KEY = 'ludo_saved_game_v1';
const SETTINGS_KEY = 'ludo_settings_v1';
const STATS_KEY = 'ludo_stats_v1';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalCaptures: number;
  totalSixesRolled: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  turnTimerSeconds: 0, // off by default, 15 or 30 can be enabled
  animationSpeed: 'normal',
  autoPassOnNoMoves: true,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  totalCaptures: 0,
  totalSixesRolled: 0,
};

export function saveGameState(state: GameState | null) {
  try {
    if (!state || state.isGameOver) {
      localStorage.removeItem(GAME_SAVE_KEY);
    } else {
      localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.error('Failed to save game state to localStorage', err);
  }
}

export function loadSavedGameState(): GameState | null {
  try {
    const raw = localStorage.getItem(GAME_SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed && parsed.players && !parsed.isGameOver) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSavedGameState() {
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
  } catch {
    // Ignore error
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore error
  }
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

export function updateStats(updater: (prev: GameStats) => GameStats) {
  try {
    const current = loadStats();
    const updated = updater(current);
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore error
  }
}
