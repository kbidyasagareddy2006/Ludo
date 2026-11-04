/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type GameMode = 'ai' | 'local2' | 'local3' | 'local4';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Token {
  id: number; // 0, 1, 2, 3
  color: PlayerColor;
  step: number; // -1: in yard, 0..50: on common path, 51..55: on home path, 56: finished/home
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  tokens: Token[];
  hasWon: boolean;
  rank?: number; // 1st, 2nd, 3rd, 4th
  capturesCount: number;
}

export type TurnPhase = 'rolling' | 'moving' | 'passed';

export interface MoveHistoryItem {
  id: string;
  timestamp: number;
  playerIndex: number;
  playerName: string;
  playerColor: PlayerColor;
  action: 'roll' | 'move' | 'release' | 'capture' | 'home' | 'pass';
  diceValue?: number;
  tokenId?: number;
  message: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  turnTimerSeconds: number; // 0 = off, 15 = 15s, 30 = 30s
  animationSpeed: 'normal' | 'fast';
  autoPassOnNoMoves: boolean;
}

export interface GameState {
  id: string;
  mode: GameMode;
  players: Player[];
  activePlayerIndex: number;
  currentDiceValue: number | null;
  consecutiveSixes: number;
  turnPhase: TurnPhase;
  legalMoves: number[]; // Array of token IDs that can legally move
  winnerRankings: PlayerColor[];
  isGameOver: boolean;
  history: MoveHistoryItem[];
  startedAt: number;
  turnTimeRemaining: number;
}
